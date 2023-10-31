import messageModel from "../../../mongo/messages/messageModel";
import pairModel from "../../../mongo/contacts/pairModel";
import {composeWithMongoose} from "graphql-compose-mongoose";
import {pubsub, safeResolvers} from "../../schema";
import sessionModel from "../../../mongo/messages/sessionModel";
import {fireAI} from "../../../ai/ai";

let MessageTC;


export default () => {
    if (!MessageTC) {

        const Pair = pairModel();
        const Message = messageModel();
        const Session = sessionModel();

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
            name: 'getsessions',
            type: '[String]',
            args: {pairId: 'String!'},
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");
                if (!args.pairId) throw new Error("Please provide pair id");
                const pair = await Pair.findById(args.pairId);
                const sessions = await Session.find({pairId: pair._id});
                return sessions.map(session => session._id.toString());
            }
        });

        MessageTC.addResolver({
            name: 'createsession',
            type: 'String',
            args: {pairId: 'String!'},
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");
                if (!args.pairId) throw new Error("Please provide pair id");
                const newSession = new Session({pairId: args.pairId});
                return (await newSession.save())._id.toString();
            }
        });


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
                    message: args.message
                });
                await newMessage.save();
                messages = await getTriplets(context.user.phone, args.sessionId);
                if (messages[messages.length - 1][0] && messages[messages.length - 1][1] && (!(messages[messages.length - 1][2]))) fireAI(args.sessionId);
                return "good";
            }
        });

        MessageTC.addResolver({
            name: "messageUpdate",
            type: MessageTC,
            args: {},
            subscribe: () =>
                pubsub.asyncIterator(["messageUpdate"])
            ,
            resolve: (payload) => payload
        });
    }

    return MessageTC;
}
