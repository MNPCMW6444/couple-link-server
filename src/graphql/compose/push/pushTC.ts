import {composeWithMongoose} from 'graphql-compose-mongoose';
import {safeResolvers} from "../../schema";
import pushModel from "../../../mongo/messages/pushModel";

let PushTC;

export default () => {
    if (!PushTC) {


        const Push = pushModel();

        try {
            PushTC = composeWithMongoose(Push);
        } catch (e) {
            PushTC = composeWithMongoose(Push, {resolvers: safeResolvers, name: "newpush"});
        }
        PushTC.addResolver({
            name: 'getpushes',
            type: [PushTC],
            args: {},
            resolve: async ({context}) => {
                if (!context.user) throw new Error("Please sign in first");
                return Push.find({
                    userId: context.user._id,
                });
            }
        });

        PushTC.addResolver({
            name: 'subscribeToPush',
            type: 'Boolean',
            args: {
                subscription: 'JSON!',
                deviceName: 'String!'
            },
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");


                const existing = await Push.find({ userId: context.user._id});
                if (existing.some(doc => doc.deviceName === args.deviceName)) throw new Error("Name already exists");
                const subscription = new Push({
                    userId: context.user._id,
                    subscription: args.subscription,
                    deviceName: args.deviceName
                });
                await subscription.save();
                return true;
            }
        });

        PushTC.addResolver({
            name: 'deletepush',
            type: 'String',
            args: {
                pushName: 'String'
            },
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");

                const toDelete= await Push.findOne({
                    userId: context.user._id,
                    deviceName: args.pushName
                });
                await toDelete.deleteOne();
                return "removed";
            }
        });


    }

    return PushTC;
}
;
