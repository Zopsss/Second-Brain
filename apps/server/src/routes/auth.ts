import { Router } from "express";
import { MongoServerError } from "mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../db";
import { CustomJwtPayload } from "../utils/CustomJwtPayload";
import z from "zod";

export const authRouter = Router();

authRouter.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const userDataValidationSchema = z
        .object({
            username: z
                .string({ required_error: "Username required." })
                .min(3, {
                    message: "Username must be at least 3 characters long.",
                })
                .max(20, {
                    message:
                        "Username should not be longer than 20 characters.",
                }),
            password: z
                .string({ required_error: "Password required." })
                .min(8, {
                    message: "Password must be at least 8 characters long.",
                })
                .max(20, {
                    message:
                        "Password should not be longer than 20 characters.",
                })
                .refine((pass) => /[a-z]/.test(pass), {
                    message:
                        "Password should contain at least one lowercase character",
                })
                .refine((pass) => /[A-Z]/.test(pass), {
                    message:
                        "Password should contain at least one uppercase character.",
                })
                .refine((pass) => /[0-9]/.test(pass), {
                    message: "Password should contain at least one digit.",
                })
                .refine((pass) => /[#?!@$%^&*-]/.test(pass), {
                    message:
                        "Password should contain at least one special character.",
                }),
            confirmPassword: z.string({
                required_error: "Confirm password required.",
            }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Password and Confirm Password didn't match.",
            path: ["confirmPassword"],
        });

    const validatedData = userDataValidationSchema.safeParse({
        username,
        password,
        confirmPassword,
    });

    if (!validatedData.success) {
        const msgs: string[] = [];
        validatedData.error.issues.forEach((issue) => {
            msgs.push(issue.message);
        });
        res.status(411).json({ msgs });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string
        );

        res.status(200).json({ token });
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
                res.status(200).json({ token });
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

        res.status(200).json({ userId: decoded.userId });
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
});
