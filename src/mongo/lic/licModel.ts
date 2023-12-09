import {connection} from "../connection";
import mongoose from "mongoose";
import {versioning} from "@mnpcmw6444/mongoose-auto-versioning";


export default () => {

    const name = "lic"

    const licModel = new mongoose.Schema(
        {
            userId: {
                type: String,
                required: true,
            },
            roleId: {
                type: String,
            },
            active: {type: Boolean, default: true},
        },
        {
            timestamps: true,
        }
    ).plugin(versioning, {collection: name + "s.history", mongoose})




    if (!connection) throw new Error("Database not initialized");

    let licModelR;
    if (mongoose.models.lic) {
        licModelR = connection.model(name);
    } else {
        licModelR = connection.model(name, licModel);
    }

    return licModelR// connection.model("lic", licModel);
};
