import {connection} from "../connection";
import mongoose from "mongoose";

const licModel = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        roleId: {
            type: String,
        },
        active: {type: Boolean, default: true},
    },
    {
        timestamps: true,
    }
);


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("lic", licModel);
};