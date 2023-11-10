import {connection} from "../connection";
import mongoose from "mongoose";

const roleModel = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
        },
        example: {
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
    return connection.model("role", roleModel);
};
