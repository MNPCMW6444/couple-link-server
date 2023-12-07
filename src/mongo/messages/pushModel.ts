import {connection} from "../connection";
import mongoose from "mongoose";
import updateVersioningPlugin from 'mongoose-update-versioning';


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
    ).plugin(updateVersioningPlugin);


    if (!connection) throw new Error("Database not initialized");

    let pushModelR;
    if (mongoose.models.user) {
        pushModelR = connection.model('user');
    } else {
        pushModelR = connection.model('user', pushModel);
    }

    return pushModelR// connection.model("push", pushModel);
};
