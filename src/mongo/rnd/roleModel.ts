import { connection } from "../connection";
import mongoose from "mongoose";

const roleModel = new mongoose.Schema(
    {
        creatorId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        publicName: {
            type: String,
        },
        role: {
            type: String,
            required: true,
        },
        setId: {
            type: String,
            required: false,
        },
        attributes: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
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
