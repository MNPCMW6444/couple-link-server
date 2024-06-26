import {composeWithMongoose} from 'graphql-compose-mongoose';
import pairModel from "../../../mongo/contacts/pairModel";
import {sendSMS} from "../../../twillio";
import userModel from "../../../mongo/auth/userModel";
import codeModel from "../../../mongo/auth/codeModel";
import {safeResolvers} from "../../schema";
import settings from "../../../settings";

let PairTC;

export default () => {
    if (!PairTC) {
        const User = userModel();
        const Code = codeModel();
        const Pair = pairModel();

        try {
            PairTC = composeWithMongoose(Pair);
        } catch (e) {
            PairTC = composeWithMongoose(Pair, {resolvers: safeResolvers, name: "newpair"});
        }

        PairTC.addResolver({
            name: 'getcontacts',
            type: '[JSON]', // Changed return type to JSON to accommodate objects
            args: {},
            resolve: async ({context}) => {
                if (!context.user) throw new Error("Please sign in first");

                // Fetch pairs where the current user is either the initiator or the acceptor
                const pairs = await Pair.find({
                    $or: [{initiator: context.user._id}, {acceptor: context.user._id}],
                    active: true
                });

                // Extract contact user IDs from pairs
                const contactIds = pairs.map(pair =>
                    pair.initiator.toString() === context.user._id.toString() ? pair.acceptor.toString() : pair.initiator.toString()
                );

                // Fetch user details of contacts
                const users = await User.find({_id: {$in: contactIds}});

                // Map each pair to an object containing phone from User and name from Pair
                return pairs.map(pair => {
                    const isInitiator = pair.initiator.toString() === context.user._id.toString();
                    const contactId = isInitiator ? pair.acceptor : pair.initiator;
                    const contactUser = users.find(user => user._id.equals(contactId));

                    return {
                        phone: contactUser ? contactUser.phone : null,
                        name: (isInitiator ? pair.acceptorName : pair.initiatorName) || contactUser.name,
                        pairId: pair._id.toString()
                    };
                });
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
                contactPhone: 'String!',
                name: 'String'
            },
            resolve: async ({args, context}) => {

                if (!context.user) throw new Error("You are not signed in");
                if (args.contactPhone === context.user.phone) throw new Error("You can't invite yourself");
                if (args.contactPhone[0] === '+') args.contactPhone = args.contactPhone.substring(1, args.contactPhone.length)
                const contactID = (await User.findOne({phone: args.contactPhone})
                    || await (new User({phone: args.contactPhone})).save())._id;
                const newCode = new Code({
                    user: contactID,
                    code: Math.floor(100000 + Math.random() * 900000)
                });
                await newCode.save();
                await sendSMS(args.contactPhone, `You have been invited to chat with ${context.user.phone}. Login at ${settings.clientDomain}/login?code=${newCode.code}&phone=${args.contactPhone}&r=contacts to accept the invitation. The code will expire in 1 hour, but you can always get a new one to log in and review the invitation.`);
                const newPair = new Pair({initiator: context.user._id, acceptor: contactID});
                if (args.name) newPair.acceptorName = args.name;
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

                if (!context.user) throw new Error("You are not signed in");
                const initiator = await User.findOne({phone: args.phone});
                const pair = await Pair.findOne({acceptor: context.user._id, initiator: initiator._id});
                if (!pair) throw new Error("No pair found for the provided initiator phone");
                if (pair.acceptor.toString() === context.user._id.toString()) {
                    pair.active = true;
                    await pair.save();
                    return "good";
                }
                throw new Error("Bad ownership");
            }
        });

        PairTC.addResolver({
            name: 'setname',
            type: 'String',
            args: {
                pairId: 'String!',
                name: 'String!'
            },
            resolve: async ({args, context}) => {


                if (!context.user) throw new Error("You are not signed in");
                try {
                    const pair = await Pair.findById(args.pairId);
                    if (pair.acceptor.toString() === context.user._id.toString()) {
                        pair.initiatorName = args.name;
                    } else
                        pair.acceptorName = args.name;
                    await pair.save();
                    return "good";
                } catch (e) {
                    throw new Error("error");
                }
            }
        });

        PairTC.addResolver({
            name: 'deletePair',
            type: 'String',
            args: {
                pairId: 'String!',
                permanently: 'Boolean!'
            },
            resolve: async ({args, context}) => {
                if (!context.user) throw new Error("You are not signed in");
                let pair;
                try {
                    pair = await Pair.findById(args.pairId);
                } catch {
                    const id1=(await User.findOne({phone:args.pairId}))._id
                    const id2=context.user._id
                    pair = await Pair.findOne({$or:[{ initiator: id1, acceptor:id2},{ initiator: id2, acceptor:id1}]});
                }
                if (!pair) throw new Error("No pair found for the provided pairId");
                if (args.permanently) {
                    await pair.deleteOne()
                } else {
                    pair.active = false;
                    if (context.user._id.toString() !== pair.acceptor.toString()) {
                        pair.initiator = pair.acceptor;
                        pair.acceptor = context.user._id.toString();
                    }
                    await pair.save();
                }
                return "good";
            }
        });
    }

    return PairTC;
}
;
