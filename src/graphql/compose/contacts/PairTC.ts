import {composeWithMongoose} from 'graphql-compose-mongoose';
import pairModel from "../../../mongo/contacts/pairModel";
import {sendSMS} from "../../../twillio";
import userModel from "../../../mongo/auth/userModel";
import codeModel from "../../../mongo/auth/codeModel";

let PairTC;


export default () => {
    if (!PairTC) {
        PairTC = composeWithMongoose(pairModel(), {});

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
                const contactIds = pairs.map(pair =>
                    pair.initiator.toString() === context.user._id.toString() ? pair.acceptor.toString() : pair.initiator.toString()
                );
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
                const areSent = args.sent
                    ? {initiator: context.user._id, active: false}
                    : {acceptor: context.user._id, active: false};
                const pairs = await Pair.find(areSent);
                const userIds = pairs.map(pair =>
                    pair.initiator.toString() === context.user._id.toString() ? pair.acceptor.toString() : pair.initiator.toString()
                );
                const users = await User.find({_id: {$in: userIds}});
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
                if (args.contactPhone === context.user.phone) throw new Error("You can't invite yourself");

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
                phone: 'String!'
            },
            resolve: async ({args, context}) => {
                if (!args.phone) throw new Error("The phone of initiator to agree is required");
                if (!context.user) throw new Error("You are not signed in");
                const pairs = await Pair.find();
                let matchedPair = null;
                for (let pair of pairs) {
                    const person = await User.findOne({_id: pair.initiator});
                    if (person && person.phone === args.phone) {
                        matchedPair = pair;
                        break;
                    }
                }
                if (!matchedPair) throw new Error("No pair found for the provided initiator phone");
                if (matchedPair.acceptor.toString() === context.user._id.toString()) {
                    matchedPair.active = true;
                    await matchedPair.save();
                    return "good";
                }
                throw new Error("Bad ownership");
            }
        });
    }

    return PairTC;
};
