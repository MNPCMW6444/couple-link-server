import {connection} from "../connection";
import mongoose from "mongoose";

const pairModel = new mongoose.Schema(
    {
        initiator:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        acceptor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        active:{type: Boolean, default: false},
    },
    {
        timestamps: true,
    }
);


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("pair", pairModel);
};
