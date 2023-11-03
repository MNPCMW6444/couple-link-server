import messageModel from "../../mongo/messages/messageModel";
import {pubsub} from "../serverSetup";

export default () => {
    const Message = messageModel();
    Message.watch().on("change", async (event) => {
        event.operationType === "insert" &&
        await pubsub.publish("newMessage", {newMessage: event.fullDocument});
    })
};