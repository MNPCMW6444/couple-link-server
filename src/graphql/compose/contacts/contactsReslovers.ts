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

    const contactID =(await User.findOne({phone: args.contactPhone}) || await (new User({phone: args.contactPhone})).save())._id

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

