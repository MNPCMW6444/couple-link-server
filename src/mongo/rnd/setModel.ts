import {connection} from "../connection";
import mongoose from "mongoose";
import updateVersioningPlugin from 'mongoose-update-versioning';


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
    ).plugin(updateVersioningPlugin);




    if (!connection) throw new Error("Database not initialized");

    let srtModelR;
    if (mongoose.models.user) {
        srtModelR = connection.model('user');
    } else {
        srtModelR = connection.model('user', srtModel);
    }

    return srtModelR// connection.model("set", srtModel);
};
