import {SchemaComposer} from 'graphql-compose';
import UserTC from './compose/user-auth/UserTC';
import PairTC from "./compose/contacts/PairTC";
import MessageTC from "./compose/chat/MessageTC";
import {AllResolversOpts} from "graphql-compose-mongoose";
import {pubsub} from "./serverSetup";


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
    const schemaComposer = new SchemaComposer();

    const User = UserTC && UserTC();
    const Pair = PairTC && PairTC();
    const Message = MessageTC && MessageTC();

    if (!User || !Pair || !Message) {
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
            type: MessageTC(), // assuming you have a MessageType defined
            description: 'Subscribe to new messages',
            subscribe: () => pubsub.asyncIterator('newMessage'),
            resolve: (payload) => {
                return payload.newMessage;
            },
        },
    });



    return schemaComposer.buildSchema();
};
