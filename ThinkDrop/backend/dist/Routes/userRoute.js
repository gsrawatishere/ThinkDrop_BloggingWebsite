"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            console.log("Request body:", req.body);
            res.status(400).json({ msg: "All fields are required!" });
            return;
        }
        const existUser = yield prisma.user.findUnique({
            where: { email }
        });
        if (existUser) {
            res.status(401).json({ msg: "User already exists! Please signin." });
            return;
        }
        const hashedpassword = yield bcryptjs_1.default.hash(password, 12);
        const newuser = yield prisma.user.create({
            data: {
                email,
                name,
                password: hashedpassword
            }
        });
        res.status(200).json({ msg: "Signup Success! Please Signin", name: newuser.name });
    }
    catch (error) {
        console.log("Erron in Signup Route", error);
        res.status(500).json({ msg: "Error in Signup", error });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ msg: "All fields are required!" });
            return;
        }
        const existUser = yield prisma.user.findUnique({
            where: { email }
        });
        if (!existUser) {
            res.status(400).json({ msg: "Email not found!" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, existUser.password);
        if (!isMatch) {
            res.status(400).json({ msg: "Invalid Password!" });
        }
        const token = jsonwebtoken_1.default.sign({ email: existUser.email }, config_1.JWT_SECRET);
        res.status(200).json({ msg: "Signin Success!", token: token });
    }
    catch (error) {
        console.log("Error in Signin route", error);
        res.status(400).json({ msg: "Error in Signup!", error });
    }
}));
exports.default = router;
