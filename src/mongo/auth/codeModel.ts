import {connection} from "../connection";
import mongoose from "mongoose";
import {versioning} from "@mnpcmw6444/mongoose-auto-versioning";






export default () => {

    const name = "code"


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
    ).plugin(versioning, {collection: name + "s.history", mongoose})


    if (!connection) throw new Error("Database not initialized");

    let codeModelR;
    if (mongoose.models.code) {
        codeModelR = connection.model(name);
    } else {
        codeModelR = connection.model(name, codeModel);
    }

    return codeModelR// connection.model("code", codeModel);
};
