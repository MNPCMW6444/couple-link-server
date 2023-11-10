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
            required: false,
        },
        messageTwoExample: {
            type: String,
            required: false,
        },
        setId: {
            type: String,
            required: false,
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
            required: false,
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
