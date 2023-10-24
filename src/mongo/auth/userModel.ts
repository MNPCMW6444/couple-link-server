import {connection} from "../connection";
import mongoose from "mongoose";

const userModel = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {type: String, required: true},
        name: {
            type: String,
            required: true,
        },
        type: {
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
    return connection.model("user", userModel);
};
