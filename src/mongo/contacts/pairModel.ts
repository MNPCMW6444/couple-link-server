import {connection} from "../connection";
import mongoose from "mongoose";
import version from "mongoose-versioned";

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
            timestamps: true, autoIndex: true
        }
    ).plugin(version, {collection: 'pairs_versions'})
;


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("pair", pairModel);
};
