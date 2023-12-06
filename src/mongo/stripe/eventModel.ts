import {connection} from "../connection";
import mongoose from "mongoose";
import version from "mongoose-versioned";

const eventModel = new mongoose.Schema(
    {
        event: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
); //.plugin(version, {collection: 'events_versions'});


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("event", eventModel);
};
