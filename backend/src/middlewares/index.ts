import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { CustomJwtPayload } from "../utils";

export const userAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization as string;

    try {
        console.log("before decoded");
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as CustomJwtPayload;

        console.log("after decoded");
        if (decoded) {
            console.log("inside if");
            req.userId = decoded.userId;
            next();
        } else {
            console.log("inside else");
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
