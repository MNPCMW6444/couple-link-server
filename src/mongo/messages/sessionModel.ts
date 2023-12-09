import {connection} from "../connection";
import mongoose from "mongoose";
import {versioning} from "@mnpcmw6444/mongoose-auto-versioning";


export default () => {

    const name = "session"

    const sessionModel = new mongoose.Schema(
        {
            pairId: {
                type: String,
                required: true,
            },
            roleId: {
                type: String,
                required: true,
            },
            name: {
                type: String,
            },
            hiddenFor: {type: String},
        },
        {
            timestamps: true,
        }
    ).plugin(versioning, {collection: name + "s.history", mongoose})


    if (!connection) throw new Error("Database not initialized");

    let sessionModelR;
    if (mongoose.models.session) {
        sessionModelR = connection.model(name);
    } else {
        sessionModelR = connection.model(name, sessionModel);
    }

    return sessionModelR// connection.model("session", sessionModel);
};
