import {connection} from "../connection";
import mongoose from "mongoose";


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
    );




    if (!connection) throw new Error("Database not initialized");

    let eventModelR;
    if (mongoose.models.event) {
        eventModelR = connection.model('event');
    } else {
        eventModelR = connection.model('event', eventModel);
    }

    return eventModelR//  connection.model("event", eventModel);
};
