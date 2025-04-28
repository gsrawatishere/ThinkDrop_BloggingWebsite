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
const express_1 = __importDefault(require("express"));
const validate_1 = require("../middleware/validate");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/blogpost", validate_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            res.status(400).json({ msg: "All fields are required to post a blog!" });
            return;
        }
        const blog = yield prisma.post.create({
            data: {
                title: title,
                content: content,
                authorid: req.userId
            }
        });
        res.status(200).json({ msg: "Blog posted successfully!", blog });
    }
    catch (error) {
        console.log("Error in Blogpost route!", error);
        res.status(400).json({ msg: "Error in Posting Blog!", error });
    }
}));
router.put("/updateblog", validate_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id, title, content } = req.body;
        if (!id) {
            res.status(400).json({ msg: "Blog id not found!" });
            return;
        }
        const blogdata = yield prisma.post.findUnique({
            where: {
                id: id
            }
        });
        if (!blogdata) {
            res.status(400).json({ msg: "Blog not found!" });
            return;
        }
        const updatedblog = yield prisma.post.update({
            where: {
                id: id
            },
            data: {
                title: title || blogdata.title,
                content: content || blogdata.content
            }
        });
        res.status(200).json({
            msg: "Blog updated successfully", blog: updatedblog
        });
    }
    catch (error) {
        console.log("Error in blogupdate route!", error);
        res.status(500).json({ msg: "Error in posting blog " });
    }
}));
router.post("/blog", validate_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogid = req.body.id;
        if (!blogid) {
            res.status(400).json({ msg: "blog id not found!" });
            return;
        }
        const blog = yield prisma.post.findUnique({
            where: {
                id: blogid
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!blog) {
            res.status(400).json({
                msg: "Blog not found!"
            });
            return;
        }
        res.status(200).json({ blog: blog });
    }
    catch (error) {
        console.log("Error in blog route", error);
        res.status(500).json({
            msg: "Error in fetching blog!"
        });
    }
}));
router.get("/myblogs", validate_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myblogs = yield prisma.post.findMany({
            where: {
                authorid: req.userId
            },
            orderBy: {
                createdAt: 'desc',
            }
        });
        if (!myblogs) {
            res.status(400).json({ msg: "Blogs are not available!" });
            return;
        }
        res.status(200).json({ myblogs: myblogs });
    }
    catch (error) {
        console.log("Error in My Blogs Route", error);
        res.status(500).json({ msg: "Error in fetching myblogs" });
    }
}));
router.delete("/blogdelete/:id", validate_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ msg: "Blog id not found!" });
            return;
        }
        const response = yield prisma.post.delete({
            where: {
                id: id,
            }
        });
        res.status(200).json({ msg: "Blog deleted Successfully!", blog: response });
    }
    catch (error) {
        console.log("Error in delete blog route!", error);
        res.status(500).json({ msg: "Error in Deleting Blog!" });
    }
}));
router.get("/allblogs", validate_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield prisma.post.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!blog) {
            res.status(400).json({ msg: "Blogs are not available!" });
            return;
        }
        res.status(200).json({ blogs: blog, username: req.name });
    }
    catch (error) {
        console.log("Error in All Blogs Route", error);
        res.status(500).json({ msg: "Error in fetching blogs" });
    }
}));
exports.default = router;
