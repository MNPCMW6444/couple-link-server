import messageModel from "../../mongo/messages/messageModel";
import {pubsub} from "../serverSetup";
import sessionModel from "../../mongo/messages/sessionModel";

export default () => {
    const Message = messageModel();
    Message.watch().on("change", async (event) => {
        event.operationType === "insert" &&
        await pubsub.publish("newMessage", {newMessage: event.fullDocument});
    })

    const Session = sessionModel();
    Session.watch().on("change", async (event) => {
        event.operationType === "insert" &&
        await pubsub.publish("newSession", {newSession: event.fullDocument});
    })
};