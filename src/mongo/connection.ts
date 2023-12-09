import mongoose from "mongoose";
import settings from "../settings";

export let connection: mongoose.Connection | null = null;

export const connect = async () => {
    try {
        await mongoose.connect(settings.mongoURI);
        console.log("Mongo DB connected successfully");
        connection = mongoose.connection;
    } catch (err) {
        console.error("mongo connection error:" + err.message);
        throw new Error(err);
    }
};

