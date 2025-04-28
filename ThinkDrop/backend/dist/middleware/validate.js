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
exports.userMiddleware = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const prisma = new client_1.PrismaClient();
const userMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer")) {
            res.status(401).json({ msg: "Unauthorized! Access Denied" });
            return;
        }
        const finaltoken = token.split(" ")[1];
        const data = jsonwebtoken_1.default.verify(finaltoken, config_1.JWT_SECRET);
        const email = data.email;
        const user = yield prisma.user.findUnique({
            where: { email: email }
        });
        if (!user) {
            res.status(403).json({ msg: "User not found. Access Denied!" });
            return;
        }
        req.userId = user.id;
        req.name = (_a = user.name) !== null && _a !== void 0 ? _a : undefined;
        next();
    }
    catch (error) {
        console.log("Error in Middleware", error);
        res.status(400).json({ msg: "Error in Authentication Middleware!" });
    }
});
exports.userMiddleware = userMiddleware;
