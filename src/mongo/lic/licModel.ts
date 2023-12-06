import {connection} from "../connection";
import mongoose from "mongoose";
import version from "mongoose-version";

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
).plugin(version, {collection: 'lics_versions'});


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("lic", licModel);
};
