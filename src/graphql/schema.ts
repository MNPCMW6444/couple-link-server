import { SchemaComposer} from 'graphql-compose';
import UserTC from './compose/user-auth/UserTC';
import PairTC from "./compose/contacts/PairTC";
import MessageTC from "./compose/chat/MessageTC";
import SessionTC from "./compose/chat/SessionTC";
import {AllResolversOpts} from "graphql-compose-mongoose";
import {pubsub} from "./serverSetup";
import RoleTC from "./compose/rnd/RoleTC";


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


    const User = UserTC && UserTC();
    const Pair = PairTC && PairTC();
    const Message = MessageTC && MessageTC();
    const Session = SessionTC && SessionTC();
    const Role = RoleTC() && RoleTC();


    if (!User || !Pair || !Message || !Session|| !Role) {
        return null;
    }

    schemaComposer.Query.addFields({
        getme: User.getResolver('getme'),
        getcontacts: Pair.getResolver('getcontacts'),
        getinvitations: Pair.getResolver('getinvitations'),
        gettriplets: Message.getResolver('gettriplets'),
        getsessions :Session.getResolver('getsessions'),
        getroles :Role.getResolver('getroles'),
    });

    schemaComposer.Mutation.addFields({
        signreq: User.getResolver('signreq'),
        signin: User.getResolver('signin'),
        signout: User.getResolver('signout'),
        newpair: Pair.getResolver('newpair'),
        agreepair: Pair.getResolver('agreepair'),
        sendmessage: Message.getResolver('sendmessage'),
        createsession: Session.getResolver('createsession'),
        renamesession: Session.getResolver('renamesession'),
        subscribeToPush: Message.getResolver('subscribeToPush'),
        addrole: Role.getResolver('addrole'),
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
        newInvitation: {
            type: Pair,
            description: 'Subscribe to new invitations',
            subscribe: () => pubsub.asyncIterator('newInvitation'),
            resolve: (payload) => {
                return payload.newInvitation;
            },
        },
        invitationAccepted: {
            type: Pair,
            description: 'Subscribe to invitations acceptences',
            subscribe: () => pubsub.asyncIterator('newInvitation'),
            resolve: (payload) => {
                return payload.newInvitation;
            },
        },
    });

    console.log('Schema composer initialized.');

    return schemaComposer.buildSchema();
};
