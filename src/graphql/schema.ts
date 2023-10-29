import {SchemaComposer} from 'graphql-compose';

import UserTC from './compose/user-auth/UserTC';
import PairTC from "./compose/contacts/PairTC";


export default () => {

    const schemaComposer = new SchemaComposer();


    schemaComposer.Query.addFields({
        getme: UserTC().getResolver('getme'),
        getcontacts : PairTC().getResolver('getcontacts'),
        getinvitations : PairTC().getResolver('getinvitations'),
    });


    schemaComposer.Mutation.addFields({
        signreq: UserTC().getResolver('signreq'),
        signin: UserTC().getResolver('signin'),
        signout: UserTC().getResolver('signout'),
        newpair: PairTC().getResolver('newpair'),
        agreepair: PairTC().getResolver('agreepair'),
    });


    return schemaComposer.buildSchema()
}