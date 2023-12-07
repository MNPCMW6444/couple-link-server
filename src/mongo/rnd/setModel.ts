import {connection} from "../connection";
import mongoose from "mongoose";
import version from "mongoose-versioned";

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
        timestamps: true, autoIndex: true
    }
)//.plugin(version, {collection: 'sets_versions',mongoose},);


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("set", srtModel);
};
