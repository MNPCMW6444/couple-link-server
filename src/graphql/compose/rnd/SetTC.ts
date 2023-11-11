import {composeWithMongoose} from 'graphql-compose-mongoose';
import {safeResolvers} from "../../schema";
import setModel from "../../../mongo/rnd/setModel";

let SetTC;

export default () => {
    if (!SetTC) {
        const Set = setModel();
        try {
            SetTC = composeWithMongoose(Set);
        } catch (e) {
            SetTC = composeWithMongoose(Set, {resolvers: safeResolvers, name: "newset"});
        }

        SetTC.addResolver({
            name: 'getmysets',
            type: [SetTC],
            args: {},
            resolve: async ({context}) => {
                if (!context.user) throw new Error("Please sign in first");
                return Set.find({creatorId: context.user._id.toString()});
            }
        });

        SetTC.addResolver({
            name: 'getsetname',
            type: 'String',
            args: {
                id: 'String!',
            },
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");
                if (!args.id) throw new Error("Please give id");
                return (await Set.findById(args.id)).name;
            }
        });

        SetTC.addResolver({
            name: 'addset',
            type: 'String',
            args: {
                name: 'String!',
                stringifiedArray: 'String!'
            },
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");
                return (await (new Set({
                    creatorId: context.user._id.toString(),
                    name: args.name,
                    stringifiedArray: args.stringifiedArray
                })).save())._id.toString();
            }
        });

        SetTC.addResolver({
            name: "publishset",
            type: 'String',
            args: {
                setId: 'String!',
            },
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");
                if (!args.setId) throw new Error("What is the ID");
                const set = await Set.findById(args.setId);
                set.visibility = true;
                await set.save()
                return "published";
            }
        });
    }
    return SetTC;
}
;
