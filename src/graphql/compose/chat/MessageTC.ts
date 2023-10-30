import messageModel from "../../../mongo/messages/messageModel";
import userModel from "../../../mongo/auth/userModel";
import pairModel from "../../../mongo/contacts/pairModel";
import {composeWithMongoose} from "graphql-compose-mongoose";
import {safeResolvers} from "../../schema";
import sessionModel from "../../../mongo/messages/sessionModel";

let MessageTC;

export default () => {
    if (!MessageTC) {

        const User = userModel();
        const Pair = pairModel();
        const Message = messageModel();
        const Session = sessionModel();

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
                if (!args.pairNumber) throw new Error("Please provide pair number");
                const messages = await Message.find({sessionId: args.sessionId});
                let me="", other="", ai="";
                const triplets = [];
                messages.forEach((message)=>{
                    if(message.owner === context.user.number){
                        me = message.message;
                    }else if(message.owner === "ai"){
                        ai = message.message;
                    }else{
                        other = message.message;
                    }
                    if (me && other && ai){
                        triplets.push([me, other, ai]);
                        me = "";
                        other = "";
                        ai = "";
                    }
                });
                triplets.push([me, other, ai]);
                return triplets
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
                const newMessage = new Message({sessionId: args.sessionId, owner: context.user.number, message: args.message});
                return (await newMessage.save())._id.toString();
            }
        });
    }

    return MessageTC;
}
;