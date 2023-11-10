import {connection} from "../connection";
import mongoose from "mongoose";

const roleModel = new mongoose.Schema(
    {
        creatorId: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        messageOneExample: {
            type: String,
            required: true,
        },
        messageTwoExample: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        aiMessage: {
            type: String,
            required: true,
        },
        visibility: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("role", roleModel);
};
