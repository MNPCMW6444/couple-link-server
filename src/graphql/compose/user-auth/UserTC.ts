import {composeWithMongoose} from 'graphql-compose-mongoose';
import userModel from "../../../mongo/auth/userModel";
import codeModel from "../../../mongo/auth/codeModel";
import {sendSMS} from "../../../twillio";
import jwt from "jsonwebtoken";
import settings from "../../../settings";
import {safeResolvers} from "../../schema";

let UserTC;

export default () => {
    if (!UserTC) {
        const User = userModel();
        const Code = codeModel();

        try {
            UserTC = composeWithMongoose(User);
        } catch (e) {
            UserTC = composeWithMongoose(User, {resolvers: safeResolvers, name: "newuser"});
        }

        UserTC.addResolver({
            name: 'signreq',
            type: 'String',
            args: {
                phone: 'String!'
            },
            resolve: async ({args, context}) => {
                if (context.user) throw new Error("You are already signed in");
                if (!args.phone) throw new Error("Phone number is required");
                if (args.phone[0] === '+') args.phone = args.phone.substring(1, args.phone.length)
                const newCode = new Code({
                    user: (await User.findOne({phone: args.phone}) || await (new User({phone: args.phone})).save())._id,
                    code: Math.floor(100000 + Math.random() * 900000)
                });
                await newCode.save();
                await sendSMS(args.phone, `Your code is: ${newCode.code}. It will expire in 1 hour. You can also use this link to sign in: Login at https://scailean.com/login?code=${newCode.code}&phone=${args.phone}`);
                return "good";
            }
        });

        UserTC.addResolver({
            name: 'signin',
            type: 'String',
            args: {
                code: 'Int!',
                phone: 'String!'
            },
            resolve: async ({args, context}) => {
                const {res} = context;
                if (!args.phone) throw new Error("Phone number is required");
                if (args.phone[0] === '+') args.phone = args.phone.substring(1, args.phone.length)
                const user = await User.findOne({phone: args.phone});
                const isValidCode = await Code.findOne({
                    code: args.code,
                    user: user._id,
                    $and: [{createdAt: {$gt: new Date(Date.now() - 60 * 60 * 1000)}}]
                });

                if (!isValidCode) throw new Error("Code is wrong or expired");
                const token = jwt.sign({id: user._id}, settings.jwtSecret, {expiresIn: '1d'});

                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: settings.env !== "local",
                    maxAge: 24 * 60 * 60 * 1000,
                    sameSite: settings.env !== "local" ? 'strict' : 'lax'
                });
                return "good";
            }
        });

        UserTC.addResolver({
            name: 'getme',
            type: UserTC,
            resolve: ({context}) => context.user
        });

        UserTC.addResolver({
            name: 'signout',
            type: 'String',
            resolve: ({context}) => {
                context.res.cookie('jwt', null, {
                    httpOnly: true,
                    secure: settings.env !== "local",
                    maxAge: 24 * 60 * 60 * 1000,
                    expires: new Date(0),
                    sameSite: settings.env !== "local" ? 'strict' : 'lax'
                });
                return "good";
            }
        });
    }
    return UserTC;
}
;
