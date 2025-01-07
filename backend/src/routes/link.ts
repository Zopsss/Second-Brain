import { v4 as uuidv4 } from "uuid";
import { Router } from "express";
import { brainLinkModel, contentModel } from "../db";
import { userAuthMiddleware } from "../middlewares";

export const linkRouter = Router();

// creating link and updating it's share-able status.
// May need to change this approach in future,
// might have to make different enpoints for creating link and updating link.
// TODO: ensure there's only one brain-link per user.
linkRouter.post("/share", userAuthMiddleware, async (req, res) => {
    const userId = req.userId;
    const share: boolean = req.body.share;

    if (share === undefined || share === null) {
        res.status(404).json({
            msg: "No choice provided for share-able link.",
        });
        return;
    }

    try {
        const shareableLink = await brainLinkModel.findOne({ userId });

        if (shareableLink) {
            if (shareableLink.share === share) {
                res.status(200).json({ msg: "No need to update link status" });
                return;
            }

            const updatedLink = await brainLinkModel.findOneAndUpdate(
                { _id: shareableLink.id },
                { $set: { share } },
                { new: true }
            );

            res.status(200).json({
                msg: "Link share status updated.",
                link: updatedLink,
            });
        } else {
            const hash = uuidv4();
            const createdLink = await brainLinkModel.create({
                hash,
                share,
                userId,
            });

            res.status(200).json({
                msg: `new link created with share-able status as: ${share}`,
                link: createdLink,
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: "Failed to update share-able link.",
        });
    }
});

// in frontend, ensure that this endpoint is only accessible
// if user has generated his brain-link.
linkRouter.put(
    "/share/regenerate-link",
    userAuthMiddleware,
    async (req, res) => {
        const userId = req.userId;

        try {
            const newHash = uuidv4();
            const newBrainLink = await brainLinkModel.findOneAndUpdate(
                { userId },
                { hash: newHash },
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
    }
);

// getting content with share-able link.
linkRouter.get("/:shareLink", async (req, res) => {
    const shareLink: string = req.params.shareLink;

    try {
        const brainLink = await brainLinkModel.findOne({ hash: shareLink });

        if (brainLink) {
            const brainContent = await contentModel
                .find({
                    userId: brainLink.userId,
                })
                .populate({ path: "tags", select: "title" });

            if (brainContent) {
                res.status(200).json({ brainContent });
            } else {
                res.status(404).json({
                    msg: "No content found with provided link. User might have no content stored.",
                });
            }
        } else {
            res.status(404).json({
                msg: "No content found with provided link.",
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: "Failed to fetch content with provided link.",
        });
    }
});
