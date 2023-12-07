import {connection} from "../connection";
import mongoose from "mongoose";



export default () => {

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
    );


    if (!connection) throw new Error("Database not initialized");

    let userModelR;
    if (mongoose.models.user) {
        userModelR = connection.model('user');
    } else {
        userModelR = connection.model('user', userModel);
    }

    return userModelR// connection.model("user", userModel);
};
