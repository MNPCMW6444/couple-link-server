import {connection} from "../connection";
import mongoose from "mongoose";
import version from "mongoose-versioned";

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
).plugin(version, {collection: 'codes_versions'});


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("code", codeModel);
};
