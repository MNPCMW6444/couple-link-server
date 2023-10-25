import {SchemaComposer} from 'graphql-compose';

import UserTC from './compose/user-auth/User';


export default () => {

    const schemaComposer = new SchemaComposer();


    schemaComposer.Query.addFields({
        getme: UserTC().getResolver('getme'),
    });


    schemaComposer.Mutation.addFields({
        signreq: UserTC().getResolver('signreq'),
        signin: UserTC().getResolver('signin'),
    });


    return schemaComposer.buildSchema()
}