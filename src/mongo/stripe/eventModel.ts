import {connection} from "../connection";
import mongoose from "mongoose";

const eventModel = new mongoose.Schema(
    {
        event: {
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
    return connection.model("event", eventModel);
};
