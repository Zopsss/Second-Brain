import { Request, Response, Router } from "express";
import { userAuthMiddleware } from "../middlewares";
import { contentModel, tagsModel } from "../db";
import { Types } from "mongoose";

export const contentRouter = Router();

const convertTagsToAssociatedTagsIds = async (tags: string[]) => {
    let associatedTagIds: Types.ObjectId[] = [];

    // Using a for...of loop to handle asynchronous operations properly
    for (const title of tags) {
        const newOrExistingTag = await tagsModel.findOneAndUpdate(
            { title },
            { title },
            { upsert: true, new: true }
        );

        associatedTagIds.push(newOrExistingTag._id);
    }

    return associatedTagIds;
};

// adding content
contentRouter.post(
    "/",
    userAuthMiddleware,
    async (req: Request, res: Response) => {
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
            if (tags && tags.length > 0) {
                let associatedTagIds =
                    await convertTagsToAssociatedTagsIds(tags);

                const createdContent = await contentModel.create({
                    link,
                    title,
                    tags: associatedTagIds,
                    type,
                    userId,
                });

                res.status(200).json({ createdContent });
                return;
            }
            const createdContent = await contentModel.create({
                link,
                title,
                type,
                userId,
            });

            res.status(200).json({ createdContent });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: "Content not added.",
            });
        }
    }
);

contentRouter.get(
    "/:type",
    userAuthMiddleware,
    async (req: Request, res: Response) => {
        const userId = req.userId;
        const { type } = req.params;

        try {
            if (type === "all-links") {
                const response = await contentModel
                    .find({ userId })
                    .populate({ path: "tags", select: "title" });

                res.status(200).json({ response });
                return;
            }

            const response = await contentModel
                .find({ userId, type })
                .populate({ path: "tags", select: "title" });

            console.log(response);
            res.status(200).json({ response });
        } catch (error) {
            res.status(500).json({
                msg: "error while fetching content with given type.",
            });
        }
    }
);

// searching content based on provided title or tags
contentRouter.post(
    "/search",
    userAuthMiddleware,
    async (req: Request, res: Response) => {
        const userId = req.userId as string;
        const { title, tags } = req.body;

        if (!title && (!tags || tags instanceof String)) {
            res.status(400).json({
                msg: "At least one of 'title' or 'tags' must be provided. ",
            });
            return;
        }

        interface OrConditions {
            title?: RegExp;
            tags?: { $in: Types.ObjectId[] };
        }

        try {
            const orConditions: OrConditions[] = [];

            if (title) {
                orConditions.push({ title: new RegExp(title as string, "i") });
            }

            if (tags) {
                // retrieving tags' id only, but it is fetched in array -> object format, like this:
                // [{ _id: "id of first tag" }, { _id: "id of second tag" }, ...]
                const fetchedTags = await tagsModel.find(
                    { title: { $in: tags } },
                    { id: 1 }
                );

                if (fetchedTags.length > 0) {
                    // extracting "_id" from the array of objects, new array will be like this:
                    // [ "id of first tag", "id of second tag", ...]
                    const fetchedTagsReferenceIds = fetchedTags.map(
                        (tag) => tag._id
                    );
                    orConditions.push({
                        tags: { $in: fetchedTagsReferenceIds },
                    });
                }
            }

            // "> 0" condition is needed because if there's no tag(s) in db
            // similar to the provided tag(s) and the title is also not provided
            // then orConditions's length will be 0, in this case we don't need
            // to query DB as it will not find any content.
            if (orConditions.length > 0) {
                const fetchedContent = await contentModel
                    .find({
                        userId,
                        $or: orConditions,
                    })
                    .populate({ path: "tags", select: "title" });

                if (fetchedContent.length > 0) {
                    res.status(200).json({ fetchedContent });
                } else {
                    res.status(404).json({ msg: "No content found." });
                }
            } else {
                res.status(404).json({
                    msg: "No content found.",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Failed to fetch search content." });
        }
    }
);

// updating content
contentRouter.put(
    "/",
    userAuthMiddleware,
    async (req: Request, res: Response) => {
        const userId = req.userId;
        const { contentId, title, link, tags } = req.body;

        if (!contentId) {
            res.status(400).json({ msg: "No content id provided to update." });
            return;
        }

        const updatedFields: Partial<{
            title: string;
            link: string;
            tags: Types.ObjectId[];
        }> = {};
        if (link) updatedFields.link = link;
        if (title) updatedFields.title = title;
        if (tags && tags.length > 0) {
            updatedFields.tags = await convertTagsToAssociatedTagsIds(tags);
        }

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
    }
);

// deleting content
contentRouter.delete(
    "/",
    userAuthMiddleware,
    async (req: Request, res: Response) => {
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
    }
);
