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
            let me = "", other = "", ai = "";
            const triplets = [];
            messages.forEach((message) => {
                if (message.owner === userPhone) {
                    me = message.message;
                } else if (message.owner === "ai") {
                    ai = message.message;
                } else {
                    other = message.message;
                }
                if (me && other && ai) {
                    triplets.push([me, other, ai]);
                    me = "";
                    other = "";
                    ai = "";
                }
            });
            triplets.push([me, other, ai]);
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
                if (!args.sessionId) throw new Error("Please provide session id");
                return getTriplets(context.user.phone, args.sessionId)
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
                if (!args.sessionId) throw new Error("Please provide session id");
                if (!args.message) throw new Error("Please provide message");
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
                if (messages[messages.length - 1][0] && messages[messages.length - 1][1] && (!(messages[messages.length - 1][2]))) fireAI(args.sessionId).then(); else console.log("waiting for both sides")
                return "good";
            }
        });


    }

    return MessageTC;
}
