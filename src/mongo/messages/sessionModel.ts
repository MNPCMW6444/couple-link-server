import {connection} from "../connection";
import mongoose from "mongoose";

const sessionModel = new mongoose.Schema(
    {
        pairId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("session", sessionModel);
};
