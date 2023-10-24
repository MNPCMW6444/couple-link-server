import mongoose, { ConnectOptions } from "mongoose";
import settings from "../settings";

export let connection: mongoose.Connection | null = null;

export const connect = async () => {
  console.log("Trying to connect mongodb...");



  connection =  mongoose.createConnection(
    settings.mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  );

  connection.on("error", console.error.bind(console, "mongo connection error:"));
  connection.once("open", function () {
    // we're connected!
    console.log("Mongo DB connected successfully");
  });
};

