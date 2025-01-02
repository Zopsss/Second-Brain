import { Router } from "express";
import { userAuthMiddleware } from "../middlewares";
import { contentModel } from "../db";

export const contentRouter = Router();

// adding content
contentRouter.post("/", userAuthMiddleware, async (req, res) => {
    const { link, title, tags } = req.body;
    const userId = req.userId;
    let type;

    if (link.includes("instagram")) {
        type = "Instagram";
    } else if (link.includes("youtube")) {
        type = "YouTube";
    } else if (link.includes("notion")) {
        type = "Notion";
    } else if (link.includes("x.com")) {
        type = "X";
    } else {
        type = "Others";
    }

    try {
        const response = await contentModel.create({
            link,
            title,
            // tags,
            type,
            userId,
        });

        res.status(200).json({
            msg: "Content added.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Content not added.",
        });
    }
});

// creating new tags

// getting content
contentRouter.get("/", userAuthMiddleware, (req, res) => {});

// updating content
contentRouter.put("/", userAuthMiddleware, (req, res) => {});

// deleting content
contentRouter.delete("/", userAuthMiddleware, (req, res) => {});
