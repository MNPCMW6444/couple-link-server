import {connection} from "../connection";
import mongoose from "mongoose";
import updateVersioningPlugin from 'mongoose-update-versioning';

export default () => {


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
    ).plugin(updateVersioningPlugin);




    if (!connection) throw new Error("Database not initialized");

    let eventModelR;
    if (mongoose.models.user) {
        eventModelR = connection.model('user');
    } else {
        eventModelR = connection.model('user', eventModel);
    }

    return eventModelR//  connection.model("event", eventModel);
};
