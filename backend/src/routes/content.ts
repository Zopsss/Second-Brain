import { Router } from "express";
import { userAuthMiddleware } from "../middlewares";
import { contentModel, tagsModel } from "../db";
import { Types } from "mongoose";

export const contentRouter = Router();

// adding content
contentRouter.post("/", userAuthMiddleware, async (req, res) => {
    const { link, title, tags } = req.body;
    const userId = req.userId;
    let type;

    if (link.includes("instagram")) {
        type = "Instagram";
    } else if (link.includes("youtube") || link.includes("youtu.be")) {
        type = "YouTube";
    } else if (link.includes("notion")) {
        type = "Notion";
    } else if (link.includes("x.com")) {
        type = "X";
    } else {
        type = "Others";
    }

    try {
        let associatedTagIds: Types.ObjectId[] = [];

        // Using a for...of loop to handle asynchronous operations properly
        for (const title of tags) {
            const existingTag = await tagsModel.findOne({ title });

            if (existingTag) {
                associatedTagIds.push(existingTag._id);
            } else {
                const newTag = await tagsModel.create({ title });
                associatedTagIds.push(newTag._id);
            }
        }

        await contentModel.create({
            link,
            title,
            tags: associatedTagIds,
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

// getting content
contentRouter.get("/", userAuthMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const response = await contentModel
            .find({ userId })
            .populate({ path: "tags", select: "title" });

        console.log(response);

        res.status(200).json({ response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error while retrieving content" });
    }
});

// updating content
contentRouter.put("/", userAuthMiddleware, async (req, res) => {
    const userId = req.userId;
    const { contentId, title, link } = req.body;

    if (!contentId) {
        res.status(400).json({ msg: "No content id provided to update." });
        return;
    }

    const updatedFields: Partial<{ title: string; link: string }> = {};
    if (link) updatedFields.link = link;
    if (title) updatedFields.title = title;

    try {
        const updatedContent = await contentModel
            .findOneAndUpdate(
                { _id: contentId, userId },
                { $set: updatedFields },
                { new: true }
            )
            .populate({ path: "tags", select: "title" });

        if (!updatedContent) {
            res.status(404).json({
                msg: "Content not found or not authorized.",
            });
            return;
        }

        res.status(200).json({
            msg: "Content updated successfully.",
            content: updatedContent,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Failed to update content." });
    }
});

// deleting content
contentRouter.delete("/", userAuthMiddleware, async (req, res) => {
    const userId = req.userId;
    const contentId = req.body.contentId;

    if (!contentId) {
        res.status(400).json({ msg: "No content id provided to delete." });
        return;
    }

    try {
        const deletedContent = await contentModel.deleteOne({
            _id: contentId,
            userId,
        });

        if (!deletedContent) {
            res.status(404).json({
                msg: "Content not found or not authorized.",
            });
            return;
        }

        res.status(200).json({
            msg: "Content deleted successfully.",
            content: deletedContent,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Failed to delete content." });
    }
});
