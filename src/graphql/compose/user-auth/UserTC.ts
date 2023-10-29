import { composeWithMongoose } from 'graphql-compose-mongoose';
import userModel from "../../../mongo/auth/userModel";
import settings from "../../../settings";
import codeModel from "../../../mongo/auth/codeModel";
import {sendSMS} from "../../../twillio";
import jwt from "jsonwebtoken";

let UserTC;

export default () => {
    if (!UserTC) {
        const customizationOptions = { name: 'UniqueUserTypeName' };
        UserTC = composeWithMongoose(userModel(), customizationOptions);

        const User = userModel();
        const Code = codeModel();

        UserTC.addResolver({
            name: 'signreq',
            type: 'String',
            args: {
                phone: 'String!'
            },
            resolve: async ({ args, context }) => {
                if (context.user) throw new Error("You are already signed in");
                if (!args.phone) throw new Error("Phone number is required");

                const newCode = new Code({
                    user: (await User.findOne({ phone: args.phone }) || await (new User({ phone: args.phone })).save())._id,
                    code: Math.floor(100000 + Math.random() * 900000)
                });

                await newCode.save();
                await sendSMS(args.phone, `Your code is: ${newCode.code}`);

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
            resolve:  async ({ args, context }) => {
                const { res } = context;
                const User = userModel();
                const Code = codeModel();

                if (context.user) throw new Error("You are already signed in");
                if (!args.code) throw new Error("Code is required");
                if (!args.phone) throw new Error("Phone number is required");
                if (!await Code.findOne({
                    code: args.code,
                    user: (await User.findOne({ phone: args.phone }))._id,
                    $and: [{ createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } }]
                })) throw new Error("Code is wrong or expired");

                const user = await User.findOne({ phone: args.phone });
                const token = jwt.sign({ id: user._id }, settings.jwtSecret, { expiresIn: '1d' });

                if (!res) throw new Error("Response object is not available in context.");

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
            args: {},
            resolve: async ({ context }) => context.user
        });

        UserTC.addResolver({
            name: 'signout',
            type: 'String',
            args: {},
            resolve: async ({ context }) => {
                const { res } = context;

                res.cookie('jwt', null, {
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
};
