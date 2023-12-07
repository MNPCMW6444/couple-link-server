import {connection} from "../connection";
import mongoose from "mongoose";
import updateVersioningPlugin from 'mongoose-update-versioning';

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
    ).plugin(updateVersioningPlugin);



    if (!connection) throw new Error("Database not initialized");

    let pairModelR;
    if (mongoose.models.user) {
        pairModelR = connection.model('user');
    } else {
        pairModelR = connection.model('user', pairModel);
    }

    return pairModelR// connection.model("pair", pairModel);
};
