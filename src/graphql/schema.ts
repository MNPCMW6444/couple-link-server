import {SchemaComposer} from 'graphql-compose';

import UserTC from './compose/user-auth/User';


export default () => {

    const schemaComposer = new SchemaComposer();

// Queries
    schemaComposer.Query.addFields({
        userById: UserTC().getResolver('findById'),
        userByIds: UserTC().getResolver('findByIds'),
        allUsers: UserTC().getResolver('findMany'),
        // ... add more queries
    });

// Mutations
    schemaComposer.Mutation.addFields({
        createOne: UserTC().getResolver('createOne'),
        updateById: UserTC().getResolver('updateById'),
        removeById: UserTC().getResolver('removeById'),
        signreq: UserTC().getResolver('signreq'),
        signin: UserTC().getResolver('signin'),

        // ... add more mutations
    });


    return schemaComposer.buildSchema()
}