import { SchemaComposer} from 'graphql-compose';
import UserTC from './compose/user-auth/UserTC';
import PairTC from "./compose/contacts/PairTC";
import MessageTC from "./compose/chat/MessageTC";
import {AllResolversOpts, composeWithMongoose} from "graphql-compose-mongoose";
import {pubsub} from "./serverSetup";
import sessionModel from "../mongo/messages/sessionModel";


export const safeResolvers: AllResolversOpts = {
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
};


export default () => {
    console.log('Initializing schema composer...');

    const schemaComposer = new SchemaComposer();


    // Use a consistent name for the type, and check if it's already created.
    const typeName = 'SessionTypeX'; // A consistent type name

    if (schemaComposer.has(typeName)) {
        schemaComposer.delete(typeName);
    }


    if (!schemaComposer.has(typeName)) {
        // Assuming sessionModel is a Mongoose model and not a function.
        const SessionTC = composeWithMongoose(sessionModel(), { resolvers: safeResolvers });
        schemaComposer.set(typeName, SessionTC);
    }


    const Session = schemaComposer.getOTC(typeName);
    const User = UserTC && UserTC();
    const Pair = PairTC && PairTC();
    const Message = MessageTC && MessageTC();


    if (!User || !Pair || !Message || !Session) {
        return null;
    }

    schemaComposer.Query.addFields({
        getme: User.getResolver('getme'),
        getcontacts: Pair.getResolver('getcontacts'),
        getinvitations: Pair.getResolver('getinvitations'),
        getsessions: Message.getResolver('getsessions'),
        gettriplets: Message.getResolver('gettriplets')
    });

    schemaComposer.Mutation.addFields({
        signreq: User.getResolver('signreq'),
        signin: User.getResolver('signin'),
        signout: User.getResolver('signout'),
        newpair: Pair.getResolver('newpair'),
        agreepair: Pair.getResolver('agreepair'),
        createsession: Message.getResolver('createsession'),
        sendmessage: Message.getResolver('sendmessage')
    });


    schemaComposer.Subscription.addFields({
        newMessage: {
            type: Message,
            description: 'Subscribe to new messages',
            subscribe: () => pubsub.asyncIterator('newMessage'),
            resolve: (payload) => {
                return payload.newMessage;
            },
        },
        newSession: {
            type: Session,
            description: 'Subscribe to new sessions',
            subscribe: () => pubsub.asyncIterator('newSession'),
            resolve: (payload) => {
                return payload.newSession;
            },
        },
    });

    console.log('Schema composer initialized.');

    return schemaComposer.buildSchema();
};
