import express, { json } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import { authRouter, contentRouter } from "./routes/index";
import { linkRouter } from "./routes/link";

const port = Number(process.env.PORT || 8080);

const app = express();
app.options("*", cors());
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
app.use(json());

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
        app.listen(port, () => {
            console.log(`Server started at PORT ${port}`);
        });
    })
    .catch((error) => {
        console.log("Error while connecting to DB");
        console.log(error);
    });
