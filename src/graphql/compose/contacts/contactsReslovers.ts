import userModel from "../../../mongo/auth/userModel";
import codeModel from "../../../mongo/auth/codeModel";
import {sendSMS} from "../../../twillio";
import pairModel from "../../../mongo/contacts/pairModel";

export const newpairResolver = async ({args, context}) => {
    const User = userModel()
    const Code = codeModel()
    const Pair = pairModel()

    if (!args.contactPhone) {
        throw new Error("Phone number is required");
    }

    if (!context.user) throw new Error("You are not signed in");

    const contactID = (await User.findOne({phone: args.contactPhone}) || await (new User({phone: args.contactPhone})).save())._id

    const newCode = new Code({
        user: contactID,
        code: Math.floor(100000 + Math.random() * 900000)
    });

    await newCode.save();

    await sendSMS(args.contactPhone, "You have been invited. Your code is:" + newCode.code);

    const newPair = new Pair({initiator: context.user._id, acceptor: contactID});

    await newPair.save();

    return "good";

};


export const agreepairResolver = async ({args, context}) => {
    const Pair = pairModel();
    if (!args.pairId) {
        throw new Error("the pair id of pair to agree is required")
    }
    if (!context.user) throw new Error("You are not signed in");
    const pair = await Pair.findById(args.pairId);
    if (pair.acceptor === context.use._id) {
        pair.active = true;
        await pair.save();
        return "good";
    }
    throw new Error("bad ownership");

};


export const getcontactsResolver = async ({context}) => {
    const Pair = pairModel();

    if (!context.user)
        throw new Error("please sign in first")

    const x = await Pair.find({$or: [{initiator: context.user._id}, {acceptor: context.user._id}], active: true})
    console.log(x)
    return x
};






