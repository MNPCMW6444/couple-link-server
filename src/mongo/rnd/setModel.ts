import {connection} from "../connection";
import mongoose from "mongoose";



export default () => {

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
    );




    if (!connection) throw new Error("Database not initialized");

    let srtModelR;
    if (mongoose.models.set) {
        srtModelR = connection.model('set');
    } else {
        srtModelR = connection.model('set', srtModel);
    }

    return srtModelR// connection.model("set", srtModel);
};
