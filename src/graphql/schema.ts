import {SchemaComposer} from 'graphql-compose';
import UserTC from './compose/user-auth/UserTC';
import PairTC from "./compose/contacts/PairTC";

export const safeResolvers:any =  {
    count: false,
        findById: false,
        findByIds: false,
        findMany: false,
        findOne: false,
        dataLoader: false,
        dataLoaderMany: false,
        createOne: false,
        createMany: false,
        updateById: false,
        updateOne: false,
        updateMany: false,
        removeById: false,
        removeOne: false,
        removeMany: false,
        pagination: false,
        connection: false
}
export default () => {
    const schemaComposer = new SchemaComposer();
    const User = UserTC && UserTC();
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