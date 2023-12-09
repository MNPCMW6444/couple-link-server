import {connection} from "../connection";
import mongoose from "mongoose";
import {versioning} from "@mnpcmw6444/mongoose-auto-versioning";



export default () => {

    const name = "push"

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
    ).plugin(versioning, {collection: name + "s.history", mongoose})


    if (!connection) throw new Error("Database not initialized");

    let pushModelR;
    if (mongoose.models.push) {
        pushModelR = connection.model(name);
    } else {
        pushModelR = connection.model(name, pushModel);
    }

    return pushModelR// connection.model("push", pushModel);
};
