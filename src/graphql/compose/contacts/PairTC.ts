import {composeWithMongoose} from 'graphql-compose-mongoose';
import pairModel from "../../../mongo/contacts/pairModel";
import {agreepairResolver, getcontactsResolver, newpairResolver} from "./contactsReslovers";

let PairTC;

export default () => {
    if (!PairTC) {
        const customizationOptions = {name: 'UniquePairTypeName'};
        PairTC = composeWithMongoose(pairModel(), customizationOptions);

        PairTC.addResolver({
            name: 'getcontacts',
            type: [PairTC],
            args: {
            },
            resolve: getcontactsResolver
        });
        PairTC.addFields({
            getcontacts: {
                type: [PairTC],
                args: {
                    },
                resolve: getcontactsResolver
            }
        });

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

        PairTC.addResolver({
            name: 'agreepair',
            type: 'String',
            args: {
                pairId: 'String!'
            },
            resolve: agreepairResolver
        });
        PairTC.addFields({
            agreepair: {
                type: 'String',
                args: {
                    pairId: 'String!'
                },
                resolve: agreepairResolver
            }
        });


    }

    return PairTC;
};


