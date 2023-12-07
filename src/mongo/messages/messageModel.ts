import {connection} from "../connection";
import mongoose from "mongoose";
import updateVersioningPlugin from 'mongoose-update-versioning';


export default () => {


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
    ).plugin(updateVersioningPlugin);


    if (!connection) throw new Error("Database not initialized");

    let messageModelR;
    if (mongoose.models.user) {
        messageModelR = connection.model('message');
    } else {
        messageModelR = connection.model('message', messageModel);
    }

    return messageModelR// connection.model("message", messageModel);
};
