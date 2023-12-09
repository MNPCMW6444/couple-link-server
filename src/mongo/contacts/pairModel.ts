import {connection} from "../connection";
import mongoose from "mongoose";
import {versioning} from "@mnpcmw6444/mongoose-auto-versioning";


export default () => {
    const name = "pair"


    const pairModel = new mongoose.Schema(
        {
            initiator: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            initiatorName: {
                type: String,
            },
            acceptor: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            acceptorName: {
                type: String,
            },
            active: {type: Boolean, default: false},}, {
            timestamps: true,
        }
    ).plugin(versioning, {collection: name + "s.history", mongoose})



    if (!connection) throw new Error("Database not initialized");

    let pairModelR: mongoose.Model<any, unknown, unknown, {}, any>;
    if (mongoose.models.pair) {
        pairModelR = connection.model(name);
    } else {
        pairModelR = connection.model(name, pairModel);
    }

    return pairModelR// connection.model("pair", pairModel);
};
