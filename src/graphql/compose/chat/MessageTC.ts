import messageModel from "../../../mongo/messages/messageModel";
import {composeWithMongoose} from "graphql-compose-mongoose";
import {safeResolvers} from "../../schema";
import {fireAI} from "../../../ai/ai";

let MessageTC;

export default () => {
    if (!MessageTC) {

        const Message = messageModel();

        const getTriplets = async (userPhone: string, sessionId: string) => {
            const messages = await Message.find({sessionId: sessionId});
            let me = "", other = "", ai = "", v2 = -1;
            const triplets = [];
            messages.forEach((message) => {
                if (message.owner === userPhone) {
                    me = message.message;
                    if (!message.whenQueried) message.whenQueried = Date.now()
                    message.save()
                    console.log("readdd")
                } else if (message.owner === "ai")
                    ai = message.message;
                else {
                    other = message.message;
                    v2 = message.whenQueried ? message.whenQueried : -1
                }

                if (me && other && ai) {
                    triplets.push([me, other, ai, v2]);
                    me = "";
                    other = "";
                    ai = "";
                    v2 = -1;
                }
            });
            triplets.push([me, other, ai, v2]);
            return triplets
        }


        try {
            MessageTC = composeWithMongoose(Message);
        } catch (e) {
            MessageTC = composeWithMongoose(Message, {resolvers: safeResolvers, name: "newmessage"});
        }


        MessageTC.addResolver({
            name: 'gettriplets',
            type: '[[String]]',
            args: {sessionId: 'String!'},
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");
                return getTriplets(context.user.phone, args.sessionId);
            }
        });

        MessageTC.addResolver({
            name: 'sendmessage',
            type: 'String',
            args: {
                sessionId: 'String!',
                message: 'String!'
            },
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");


                let messages = await getTriplets(context.user.phone, args.sessionId);
                if (messages[messages.length - 1][0] || (messages[messages.length - 1][0] && messages[messages.length - 1][1] && messages[messages.length - 1][2])) throw new Error("Please wait for your turn");
                const newMessage = new Message({
                    sessionId: args.sessionId,
                    owner: context.user.phone,
                    ownerid: context.user._id.toString(),
                    message: args.message
                });
                await newMessage.save();
                messages = await getTriplets(context.user.phone, args.sessionId);
                if (messages[messages.length - 1][0] && messages[messages.length - 1][1] && (!(messages[messages.length - 1][2]))) fireAI(args.sessionId).then()
                return "good";
            }
        });


    }

    return MessageTC;
}
