import {connection} from "../connection";
import mongoose from "mongoose";

const srtModel = new mongoose.Schema(
    {
        creatorId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        stringifiedArray: {
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
    return connection.model("set", srtModel);
};
