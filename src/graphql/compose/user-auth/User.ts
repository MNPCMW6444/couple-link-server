import {composeWithMongoose} from 'graphql-compose-mongoose';
import userModel from "../../../mongo/auth/userModel";
import {signinResolver, signreqResolver} from "./authResolvers";

let UserTC;

export default () => {
    if (!UserTC) {
        const customizationOptions = {name: 'UniqueUserTypeName'};
        UserTC = composeWithMongoose(userModel(), customizationOptions);

        UserTC.addResolver({
            name: 'signreq',
            type: 'String',
            args: {
                phone: 'String!'
            },
            resolve: signreqResolver
        });
        UserTC.addFields({
            signupReq: {
                type: 'String',
                args: {
                    phone: 'String!'
                },
                resolve: signreqResolver
            }
        });

        UserTC.addResolver({
            name: 'signin',
            type: 'String',
            args: {
                code: 'Int!',
                phone: 'String!'
            },
            resolve: signinResolver
        });
        UserTC.addFields({
            signin: {
                type: 'String',
                args: {
                    code: 'Int!',
                    phone: 'String!'
                },
                resolve: signinResolver
            }
        });

    }

    return UserTC;
};


