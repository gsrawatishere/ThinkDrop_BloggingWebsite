"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./Routes/userRoute"));
const blogRoute_1 = __importDefault(require("./Routes/blogRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/user", userRoute_1.default);
app.use("/api/v1/blog", blogRoute_1.default);
app.use((req, res) => {
    res.status(404).json({ msg: "Route not found" });
});
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
