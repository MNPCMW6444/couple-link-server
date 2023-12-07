import {connection} from "../connection";
import mongoose from "mongoose";
import updateVersioningPlugin from 'mongoose-update-versioning';




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
    ).plugin(updateVersioningPlugin);


    if (!connection) throw new Error("Database not initialized");

    let codeModelR;
    if (mongoose.models.user) {
        codeModelR = connection.model('user');
    } else {
        codeModelR = connection.model('user', codeModel);
    }

    return codeModelR// connection.model("code", codeModel);
};
