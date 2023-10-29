import {SchemaComposer} from 'graphql-compose';
import UserTC from './compose/user-auth/UserTC';
import PairTC from "./compose/contacts/PairTC";

export default () => {
    const schemaComposer = new SchemaComposer();
    const User = UserTC && UserTC();
    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
    const Pair = PairTC && PairTC();
    if(!User || !Pair) {
        return null;
    }
    schemaComposer.Query.addFields({
        getme: User.getResolver('getme'),
        getcontacts: Pair.getResolver('getcontacts'),
        getinvitations: Pair.getResolver('getinvitations'),
    });
    schemaComposer.Mutation.addFields({
        signreq: User.getResolver('signreq'),
        signin: User.getResolver('signin'),
        signout: User.getResolver('signout'),
        newpair: Pair.getResolver('newpair'),
        agreepair: Pair.getResolver('agreepair'),
    });
    return schemaComposer.buildSchema()
}