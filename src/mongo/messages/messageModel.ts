import {connection} from "../connection";
import mongoose from "mongoose";
import version from "mongoose-versioned";

const messageModel = new mongoose.Schema(
    {
        owner: {
            type: String, // number || ai
            required: true,
        },
        ownerid: {
            type: String, // stringified id || ai
            required: true,
        },
        sessionId: {type: String, required: true},
        message: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
); //.plugin(version, {collection: 'messages_versions'});


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("message", messageModel);
};
