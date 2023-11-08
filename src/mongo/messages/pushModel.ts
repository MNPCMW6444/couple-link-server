import {connection} from "../connection";
import mongoose from "mongoose";

const pushModel = new mongoose.Schema(
    {
        userId: {type: String, required: true},
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
);


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("psuh", pushModel);
};
