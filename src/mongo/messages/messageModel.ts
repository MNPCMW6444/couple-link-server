import {connection} from "../connection";
import mongoose from "mongoose";

const messageModel = new mongoose.Schema(
    {
        owner: {
            type: String, // number || ai
            required: true,
        },
        ownerid: {
            type: String, // stringified id || ai
            required: true,
        },
        sessionId: {type: String, required: true},
        message: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("message", messageModel);
};
