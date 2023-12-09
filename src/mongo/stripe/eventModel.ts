import {connection} from "../connection";
import mongoose from "mongoose";
import {versioning} from "@mnpcmw6444/mongoose-auto-versioning";


export default () => {

    const name = "event"

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
    ).plugin(versioning, {collection: name + "s.history", mongoose})




    if (!connection) throw new Error("Database not initialized");

    let eventModelR;
    if (mongoose.models.event) {
        eventModelR = connection.model(name);
    } else {
        eventModelR = connection.model(name, eventModel);
    }

    return eventModelR//  connection.model("event", eventModel);
};
