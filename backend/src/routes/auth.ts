import { Router } from "express";
import { MongoServerError } from "mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../db";
import { CustomJwtPayload } from "../utils";

export const authRouter = Router();

authRouter.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // TODO: Add ZOD validations.

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            username,
            password: hashedPassword,
        });

        res.status(200).json({
            msg: "User Created.",
        });
    } catch (error) {
        console.log(error);
        if (error instanceof MongoServerError && error.code === 11000) {
            res.status(403).json({
                msg: "User already exists.",
            });
        } else {
            res.status(500).json({
                msg: "Internal Server Error while creating user.",
            });
        }
    }
});

authRouter.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await userModel.findOne({ username });

        if (user) {
            const checkPassowrd = await bcrypt.compare(password, user.password);
            if (checkPassowrd) {
                const token = jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET as string
                );
                res.status(200).json({
                    message: "User Logged In.",
                    token,
                });
                return;
            }

            res.status(403).json({
                message: "Password is wrong.",
            });
            return;
        }

        res.status(403).json({
            message: "No user found with this username.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal server error while logging in the user.",
        });
    }
});

// used in frontend to check if the token stored in the localstorage is valid or not.
authRouter.post("/api/v1/verifyToken", (req, res) => {
    const token = req.headers.authorization as string;

    if (!token) {
        res.status(401).json({ message: "No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as CustomJwtPayload;

        res.status(200).json({
            message: "Token is valid.",
            userId: decoded.userId,
        });
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
});
