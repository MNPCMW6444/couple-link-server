import {composeWithMongoose} from 'graphql-compose-mongoose';
import pairModel from "../../../mongo/contacts/pairModel";
import {newpairResolver} from "./contactsReslovers";

let PairTC;

export default () => {
    if (!PairTC) {
        const customizationOptions = {name: 'UniquePairTypeName'};
        PairTC = composeWithMongoose(pairModel(), customizationOptions);

        PairTC.addResolver({
            name: 'newpair',
            type: 'String',
            args: {
                contactPhone: 'String!'
            },
            resolve: newpairResolver
        });
        PairTC.addFields({
            newpair: {
                type: 'String',
                args: {
                    contactPhone: 'String!'
                },
                resolve: newpairResolver
            }
        });


    }

    return PairTC;
};


