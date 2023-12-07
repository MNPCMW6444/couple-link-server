import {connection} from "../connection";
import mongoose from "mongoose";


export default () => {


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
    );




    if (!connection) throw new Error("Database not initialized");

    let licModelR;
    if (mongoose.models.lic) {
        licModelR = connection.model('lic');
    } else {
        licModelR = connection.model('lic', licModel);
    }

    return licModelR// connection.model("lic", licModel);
};
