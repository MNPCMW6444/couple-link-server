import {connection} from "../connection";
import mongoose from "mongoose";
import version from "mongoose-version";

const sessionModel = new mongoose.Schema(
    {
        pairId: {
            type: String,
            required: true,
        },
        roleId:{
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
).plugin(version, {collection: 'sessions_versions'});


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("session", sessionModel);
};
