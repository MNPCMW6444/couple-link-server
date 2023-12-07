import {connection} from "../connection";
import mongoose from "mongoose";


export default () => {


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
            active: {type: Boolean, default: false},
            archived: {type: Boolean, default: false},
        }, {
            timestamps: true,
        }
    );



    if (!connection) throw new Error("Database not initialized");

    let pairModelR;
    if (mongoose.models.pair) {
        pairModelR = connection.model('pair');
    } else {
        pairModelR = connection.model('pair', pairModel);
    }

    return pairModelR// connection.model("pair", pairModel);
};
