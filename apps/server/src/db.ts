import { model, Schema, Types } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export const userModel = model("users", UserSchema);

interface User {
    username: string;
    password: string;
}

const ContentSchema = new Schema(
    {
        link: { type: String, required: true },
        type: {
            type: String,
            enum: ["YouTube", "Notion", "X", "Instagram", "Reddit", "Others"],
            required: true,
        },
        title: { type: String, required: true },
        tags: [{ type: Types.ObjectId, ref: "tags" }],
        userId: {
            type: Types.ObjectId,
            ref: "users",
            required: true,
            validate: async (value: User) => {
                const user = await userModel.findById(value);
                if (!user) {
                    throw new Error("User does not exists for this Content.");
                }
            },
        },
    },
    { timestamps: true }
);

export const contentModel = model("content", ContentSchema);

const TagsSchema = new Schema({
    title: { required: true, type: String, unique: true },
});

export const tagsModel = model("tags", TagsSchema);

const BrainLink = new Schema({
    link: { type: String, required: true, unique: true },
    share: { type: Boolean, required: true },
    userId: {
        type: Types.ObjectId,
        ref: "users",
        required: true,
        unique: true,
    },
    // userId: { unique: true } ensures that there's only one brain-link per user.
});

export const brainLinkModel = model("brain-links", BrainLink);
