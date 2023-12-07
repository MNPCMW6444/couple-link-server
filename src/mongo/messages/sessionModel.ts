import {connection} from "../connection";
import mongoose from "mongoose";
import updateVersioningPlugin from 'mongoose-update-versioning';



export default () => {

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
    ).plugin(updateVersioningPlugin);



    if (!connection) throw new Error("Database not initialized");

    let sessionModelR;
    if (mongoose.models.user) {
        sessionModelR = connection.model('session');
    } else {
        sessionModelR = connection.model('session', sessionModel);
    }

    return sessionModelR// connection.model("session", sessionModel);
};
