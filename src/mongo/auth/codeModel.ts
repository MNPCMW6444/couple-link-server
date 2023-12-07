import {connection} from "../connection";
import mongoose from "mongoose";





export default () => {

    const codeModel = new mongoose.Schema(
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            code: {
                type: Number,
                required: true,
            }
        },
        {
            timestamps: true,
        }
    );


    if (!connection) throw new Error("Database not initialized");

    let codeModelR;
    if (mongoose.models.code) {
        codeModelR = connection.model('code');
    } else {
        codeModelR = connection.model('code', codeModel);
    }

    return codeModelR// connection.model("code", codeModel);
};
