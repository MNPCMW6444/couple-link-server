import {composeWithMongoose} from 'graphql-compose-mongoose';
import pairModel from "../../../mongo/contacts/pairModel";
import {sendSMS} from "../../../twillio";
import userModel from "../../../mongo/auth/userModel";
import codeModel from "../../../mongo/auth/codeModel";

let PairTC;


export default () => {
    if (!PairTC) {
        const customizationOptions = {name: 'UniquePairTypeName'};
        PairTC = composeWithMongoose(pairModel(), customizationOptions);

        const User = userModel();
        const Code = codeModel();
        const Pair = pairModel();

        PairTC.addResolver({
            name: 'getcontacts',
            type: '[String]',
            args: {},
            resolve: async ({context}) => {
                if (!context.user) throw new Error("Please sign in first");
                const pairs = await Pair.find({
                    $or: [{initiator: context.user._id}, {acceptor: context.user._id}],
                    active: true
                });
                const contactIds = pairs.map(({initiator, acceptor}) =>
                    (initiator === context.user._id ? acceptor : initiator));
                const users = await User.find({_id: {$in: contactIds}});
                return users.map(({phone}) => phone);
            }
        });


        PairTC.addResolver({
            name: 'getinvitations',
            type: '[String]',
            args: {
                sent: 'Boolean!'
            },
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");
                const areSent = args.sent ? {acceptor: context.user._id} : {initiator: context.user._id};
                const invitationIds= await Pair.find({...areSent, active: false});
                const users = await User.find({_id: {$in: invitationIds}});
                return users.map(({phone}) => phone);
            }
        });

        PairTC.addResolver({
            name: 'newpair',
            type: 'String',
            args: {
                contactPhone: 'String!'
            },
            resolve: async ({args, context}) => {
                if (!args.contactPhone) throw new Error("Phone number is required");
                if (!context.user) throw new Error("You are not signed in");

                const contactID = (await User.findOne({phone: args.contactPhone})
                    || await (new User({phone: args.contactPhone})).save())._id;

                const newCode = new Code({
                    user: contactID,
                    code: Math.floor(100000 + Math.random() * 900000)
                });

                await newCode.save();
                await sendSMS(args.contactPhone, `You have been invited. Your code is: ${newCode.code}`);

                const newPair = new Pair({initiator: context.user._id, acceptor: contactID});
                await newPair.save();

                return "good";
            }
        });

        PairTC.addResolver({
            name: 'agreepair',
            type: 'String',
            args: {
                pairId: 'String!'
            },
            resolve: async ({args, context}) => {
                if (!args.pairId) throw new Error("The pair id of pair to agree is required");
                if (!context.user) throw new Error("You are not signed in");

                const pair = await Pair.findById(args.pairId);

                if (pair.acceptor.toString() === context.user._id.toString()) {
                    pair.active = true;
                    await pair.save();
                    return "good";
                }
                throw new Error("Bad ownership");
            }
        });
    }

    return PairTC;
};
