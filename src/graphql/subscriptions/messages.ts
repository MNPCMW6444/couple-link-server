import messageModel from "../../mongo/messages/messageModel";
import {pubsub} from "../schema";

export default () => {
    const Message = messageModel();
    Message.watch().on("change", async (event) => {
        event.operationType === "insert" &&
        pubsub.publish("messageUpdate", {messageUpdate: await (Message.findById(event.documentKey._id.toString()))});
    })
};