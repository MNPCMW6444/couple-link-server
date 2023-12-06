import {pubsub} from "../serverSetup";
import pushModel from "../../mongo/messages/pushModel";
import {sendPushNotification} from "../../push";
import pairModel from "../../mongo/contacts/pairModel";
import userModel from "../../mongo/auth/userModel";

export default () => {
    pairModel().watch().on("change", async (event) => {
        if (event.operationType === "insert") {
            await pubsub.publish("newInvitation", {newPair: event.fullDocument});
            const toNotify = event.fullDocument.acceptor;
            const sub = await pushModel().findOne({userId: toNotify});
            const initiator = await userModel().findOne({_id: event.fullDocument.initiator});
            sub && sendPushNotification(sub.subscription, {
                title: "New Invitation",
                body: initiator.phone + " has invited you"
            }).then();
        }
        if (event.operationType === "update"&& event.updateDescription?.updatedFields?.active) {
            const doc = event?.fullDocument || (await ((pairModel()).findById(event?.documentKey?._id?.toString())))
            await pubsub.publish("invitationAccepted", {newPair: doc});
            const toNotify = doc.initiator;
            if (toNotify) {
                const sub = await pushModel().findOne({userId: toNotify});
                const acceptor = await userModel().findOne({_id: doc.acceptor});
                sub && sendPushNotification(sub.subscription, {
                    title: "New Contact",
                    body: acceptor.phone + " has accepted your invitation"
                }).then();
            }
        }
    })
};