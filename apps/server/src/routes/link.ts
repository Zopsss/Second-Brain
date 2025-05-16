import { v4 as uuidv4 } from "uuid";
import { Router } from "express";
import { brainLinkModel, contentModel, userModel } from "../db";
import { userAuthMiddleware } from "../middlewares";
import { MongoServerError } from "mongodb";
import { ENV_VARS } from "../utils/envs";

export const linkRouter = Router();

// generating link
linkRouter.post("/", userAuthMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const hash = uuidv4();
        const link = ENV_VARS.FRONTEND_URL + "/share/" + hash;
        const brainLink = await brainLinkModel.create({
            link,
            share: true,
            userId,
        });

        res.status(200).json({ brainLink });
    } catch (error) {
        console.log(error);

        if (error instanceof MongoServerError && error.code === 11000) {
            res.status(403).json({
                msg: "brain-link for this user already exists.",
            });
        } else {
            res.status(500).json({
                msg: "Internal Server Error while generating brain-link.",
            });
        }
    }
});

// updating share status
linkRouter.put("/update-share", userAuthMiddleware, async (req, res) => {
    const userId = req.userId;
    const share: boolean = req.body.share;

    if (share === undefined || share === null) {
        res.status(404).json({
            msg: "No choice provided for share-able link.",
        });
        return;
    }

    try {
        const updatedLink = await brainLinkModel.findOneAndUpdate(
            { userId },
            { $set: { share } },
            { new: true }
        );

        if (!updatedLink) {
            res.status(411).json({
                msg: "brain-link for this user doesn't exist.",
            });
            return;
        }

        res.status(200).json({
            updatedLink,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Failed to update share-able link.",
        });
    }
});

linkRouter.put("/regenerate-link", userAuthMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const hash = uuidv4();
        const brainLink = ENV_VARS.FRONTEND_URL + "/share/" + hash;
        const newBrainLink = await brainLinkModel.findOneAndUpdate(
            { userId },
            { link: brainLink },
            { new: true }
        );

        // we don't really need this if/else as we're ensuring that this endpoint
        // is only accessible when user has generted brain-link in frontend,
        // i.e a brain-link already exists for current user.
        // But I'm still adding this just in-case if someone locally tries
        // to hit this endpoint from postman or from somewhere else.
        if (newBrainLink) {
            res.status(200).json({ newBrainLink });
        } else {
            res.status(404).json({
                msg: "no brain-link found with the current user.",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Failed to regenerate brain link." });
    }
});

linkRouter.get("/", userAuthMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const brainLink = await brainLinkModel.findOne({ userId });

        if (brainLink) {
            res.status(200).json({ brainLink });
            return;
        }

        res.status(404).json({ msg: "Link not found for current user." });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error while fetching brain-link.",
        });
    }
});

// getting content with share-able link.
linkRouter.get("/:shareLink", async (req, res) => {
    const shareLink: string = req.params.shareLink;

    try {
        const brainLink = await brainLinkModel.findOne({
            link: ENV_VARS.FRONTEND_URL + "/share/" + shareLink,
        });

        if (brainLink) {
            if (!brainLink.share) {
                res.status(404).json({
                    msg: "User has disabled brain sharing.",
                });
                return;
            }
            const brainContent = await contentModel
                .find({
                    userId: brainLink.userId,
                })
                .populate({ path: "tags", select: "title" })
                .lean();

            if (brainContent) {
                res.status(200).json({ brainContent });
                return;
            }

            res.status(404).json({
                msg: "No content found with provided link. User might have no content stored.",
            });
            return;
        }

        res.status(404).json({
            msg: "No content found with provided link.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to fetch content with provided link.",
        });
    }
});
