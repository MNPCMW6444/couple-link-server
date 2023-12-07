import {connection} from "../connection";
import mongoose from "mongoose";



export default () => {


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
    );


    if (!connection) throw new Error("Database not initialized");

    let pushModelR;
    if (mongoose.models.push) {
        pushModelR = connection.model('push');
    } else {
        pushModelR = connection.model('push', pushModel);
    }

    return pushModelR// connection.model("push", pushModel);
};
