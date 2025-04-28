import express, { Application } from "express";
import cors from "cors";
import userRoute from "./Routes/userRoute"
import blogRoute from "./Routes/blogRoute"

const app : Application = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use((req, res) => {
    res.status(404).json({ msg: "Route not found" });
  });
  
app.listen(4000,()=>{
    console.log("Server is running on port 4000")
})