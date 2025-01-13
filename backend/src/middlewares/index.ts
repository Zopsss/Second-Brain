import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { CustomJwtPayload } from "../utils/CustomJwtPayload";

export const userAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization as string;

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as CustomJwtPayload;

        if (decoded) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(403).json({
                msg: "Forbidden! Something is wrong with the JWT Token.",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal server error while verifying JWT Token.",
        });
    }
};
