import {connection} from "../connection";
import mongoose from "mongoose";

const userModel = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {type: String, required: false},
        name: {
            type: String,
            required: false,
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
