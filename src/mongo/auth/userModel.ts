import {connection} from "../connection";
import mongoose from "mongoose";
import version from "mongoose-version";


const userModel = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String
        },
        passwordHash: {type: String, required: false},
        rnd: {type: Boolean, required: false},
        name: {
            type: String,
            required: false,
        },
        subscription: {
            type: String,
            required: true,
            default: "free",
        },
    },
    {
        timestamps: true,
    }
).plugin(version, {collection: 'users_versions'});


export default () => {
    if (!connection) throw new Error("Database not initialized");
    return connection.model("user", userModel);
};
