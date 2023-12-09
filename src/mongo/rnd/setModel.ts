import {connection} from "../connection";
import mongoose from "mongoose";
import {versioning} from "@mnpcmw6444/mongoose-auto-versioning";



export default () => {

    const name = "set"

    const srtModel = new mongoose.Schema(
        {
            creatorId: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            stringifiedArray: {
                type: String,
                required: true,
            },
            visibility: {
                type: Boolean,
                default: false,
            },
        },
        {
            timestamps: true,
        }
    ).plugin(versioning, {collection: name + "s.history", mongoose})




    if (!connection) throw new Error("Database not initialized");

    let srtModelR;
    if (mongoose.models.set) {
        srtModelR = connection.model(name);
    } else {
        srtModelR = connection.model(name, srtModel);
    }

    return srtModelR// connection.model("set", srtModel);
};
