import {SchemaComposer} from 'graphql-compose';
import UserTC from './compose/user-auth/UserTC';
import PairTC from "./compose/contacts/PairTC";
import MessageTC from "./compose/chat/MessageTC";
import SessionTC from "./compose/chat/SessionTC";
import {AllResolversOpts} from "graphql-compose-mongoose";
import {pubsub} from "./serverSetup";
import RoleTC from "./compose/rnd/RoleTC";
import SetTC from "./compose/rnd/SetTC";
import PushTC from "./compose/push/pushTC";
import LicTC from "./compose/shop/LicTC";


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
    const Set = SetTC() && SetTC();
    const Push = PushTC() && PushTC();
    const Lic = LicTC() && LicTC();


    if (!User || !Pair || !Message || !Session || !Role || !Set || !Push || !Lic) {
        return null;
    }

    schemaComposer.Query.addFields({
        getme: User.getResolver('getme'),
        getcontacts: Pair.getResolver('getcontacts'),
        getinvitations: Pair.getResolver('getinvitations'),
        getsessions: Session.getResolver('getsessions'),
        gettriplets: Message.getResolver('gettriplets'),
        getpushes: Push.getResolver('getpushes'),
        getmysets: Set.getResolver('getmysets'),
        getsetname: Set.getResolver('getsetname'),
        getPublicRoles: Role.getResolver('getPublicRoles'),
        getmyroles: Role.getResolver('getmyroles'),
        geyMyInventory: Lic.getResolver('geyMyInventory'),
    });

    schemaComposer.Mutation.addFields({
        signreq: User.getResolver('signreq'),
        signin: User.getResolver('signin'),
        signout: User.getResolver('signout'),
        updateRND: User.getResolver('updateRND'),
        newpair: Pair.getResolver('newpair'),
        agreepair: Pair.getResolver('agreepair'),
        setname: Pair.getResolver('setname'),
        deletePair: Pair.getResolver('deletePair'),
        createsession: Session.getResolver('createsession'),
        renamesession: Session.getResolver('renamesession'),
        deleteSession: Session.getResolver('deleteSession'),
        sendmessage: Message.getResolver('sendmessage'),
        subscribeToPush: Push.getResolver('subscribeToPush'),
        deletepush: Push.getResolver('deletepush'),
        addset: Set.getResolver('addset'),
        publishset: Set.getResolver('publishset'),
        addrole: Role.getResolver('addrole'),
        publishrole: Role.getResolver('publishrole'),
        buy: Lic.getResolver('buy'),
        tryToActivate:User.getResolver('tryToActivate'),
    });


    schemaComposer.Subscription.addFields({
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
            subscribe: () => pubsub.asyncIterator('invitationAccepted'),
            resolve: (payload) => {
                return payload.newInvitation;
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
        newMessage: {
            type: Message,
            description: 'Subscribe to new messages',
            args: {
                sessionId: 'String',
            },
            subscribe: () => pubsub.asyncIterator('newMessage'),
            resolve: (payload, args) => {
                return payload.newMessage.sessionId === args.sessionId && payload.newMessage;
            },
        },
    });

    console.log('Schema composer initialized.');

    return schemaComposer.buildSchema();
};
