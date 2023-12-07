import {connection} from "../connection";
import mongoose from "mongoose";
import version from "mongoose-versioned";

const pushModel = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        deviceName: {type: String, required: true, unique: true},
        subscription: {
            endpoint: {type: String, required: true},
            keys: {
                p256dh: {type: String, required: true},
                auth: {type: String, required: true}
            }
        }
    },
    {
        timestamps: true,
    }
).plugin(version, {collection: 'pushs_versions'});


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("push", pushModel);
};
