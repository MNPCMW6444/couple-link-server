import {connection} from "../connection";
import mongoose from "mongoose";

const codeModel = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        code: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("code", codeModel);
};
