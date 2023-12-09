import {connection} from "../connection";
import mongoose from "mongoose"
import {versioning} from "@mnpcmw6444/mongoose-auto-versioning";


export default () => {

    const name = "user"
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
    ).plugin(versioning, {collection: name + "s.history", mongoose})


    if (!connection) throw new Error("Database not initialized");

    let userModelR;
    if (mongoose.models.user) {
        userModelR = connection.model(name);
    } else {
        userModelR = connection.model(name, userModel);
    }

    return userModelR;
};
