import express, { json } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import { authRouter, contentRouter } from "./routes/index";
import { linkRouter } from "./routes/link";
import { userAuthMiddleware } from "./middlewares";
import { userModel } from "./db";

const app = express();
app.use(json());
app.use(cors());

declare global {
    namespace Express {
        export interface Request {
            userId?: string;
        }
    }
}

app.use(`${process.env.BACKEND_URL}/auth`, authRouter);
app.use(`${process.env.BACKEND_URL}/content`, contentRouter);
app.use(`${process.env.BACKEND_URL}/brain`, linkRouter);

mongoose
    .connect(process.env.MONGO_URL as string)
    .then(() => {
        console.log("Connected to DB.");
        app.listen(process.env.PORT, () => {
            console.log(`Server started at PORT ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error while connecting to DB");
        console.log(error);
    });
