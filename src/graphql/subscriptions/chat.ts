import messageModel from "../../mongo/messages/messageModel";
import {pubsub} from "../serverSetup";
import sessionModel from "../../mongo/messages/sessionModel";
import pushModel from "../../mongo/messages/pushModel";
import {sendPushNotification} from "../../push";
import pairModel from "../../mongo/contacts/pairModel";
import userModel from "../../mongo/auth/userModel";

export default () => {
    messageModel().watch().on("change", async (event) => {
        await pubsub.publish("newMessage", {newMessage: null});
        const sessionId = event.fullDocument?.sessionId;
        if (sessionId) {
            const session = await sessionModel().findById(sessionId);
            const pair = await pairModel().findById(session.pairId);
            const side1 = pair.initiator.toString()
            const side2 = pair.acceptor.toString()
            const side1Subscription = await pushModel().findOne({userId: side1});
            const side2Subscription = await pushModel().findOne({userId: side2});
            event.operationType === "insert" &&
            side1Subscription && event.fullDocument.ownerid !== side1 && sendPushNotification(side1Subscription.subscription, {
                title: "New Message From" + event.fullDocument.ownerid === "ai" ? "Dual Chat GPT" : (await (userModel().findById(side2))).phone,
                body: event.fullDocument.message
            }, {
                pairId: session.pairId,
                sessionId: sessionId
            }).then();
            event.operationType === "insert" &&
            side2Subscription && event.fullDocument.ownerid !== side2 && sendPushNotification(side1Subscription.subscription, {
                title: "New Message From" + event.fullDocument.ownerid === "ai" ? "Dual Chat GPT" : (await (userModel().findById(side1))).phone,
                body: event.fullDocument.message
            }, {
                pairId: session.pairId,
                sessionId: sessionId
            }).then();
        }
    })

    const Session = sessionModel();
    Session.watch().on("change", async (event) => {
        event.operationType === "insert" &&
        await pubsub.publish("newSession", {newSession: event.fullDocument});
    })
};