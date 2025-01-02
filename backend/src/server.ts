import express, { json } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { authRouter, contentRouter } from "./routes/index";

const app = express();
app.use(json());

mongoose.connect(process.env.MONGO_URL as string);

app.use("/", authRouter);
app.use("/api/v1/content", contentRouter);

app.listen(8080, () => {
    console.log("Server started at PORT 8080");
});
