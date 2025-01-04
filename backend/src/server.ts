import express, { json } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { authRouter, contentRouter } from "./routes/index";
import { linkRouter } from "./routes/link";

const app = express();
app.use(json());

app.use("/", authRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/brain", linkRouter);

mongoose
    .connect(process.env.MONGO_URL as string)
    .then(() => {
        console.log("Connected to DB.");
        app.listen(8080, () => {
            console.log("Server started at PORT 8080");
        });
    })
    .catch((error) => {
        console.log("Error while connecting to DB");
        console.log(error);
    });
