import {composeWithMongoose} from 'graphql-compose-mongoose';
import {safeResolvers} from "../../schema";
import roleModel from "../../../mongo/rnd/roleModel";
import {createRole} from "../../../ai/ai";
import setModel from "../../../mongo/rnd/setModel";

let RoleTC;

export default () => {
    if (!RoleTC) {
        const Role = roleModel();
        const Set = setModel();
        try {
            RoleTC = composeWithMongoose(Role);
        } catch (e) {
            RoleTC = composeWithMongoose(Role, {resolvers: safeResolvers, name: "newrole"});
        }
        RoleTC.addResolver({
            name: 'getmyroles',
            type: [RoleTC],
            args: {},
            resolve: async ({context}) => {
                if (!context.user) throw new Error("Please sign in first");
                return Role.find({creatorId: context.user._id.toString()});
            }
        });

        RoleTC.addResolver({
            name: 'addrole',
            type: 'String',
            args: {
                role: 'String!',
                setName: 'String!',
                roleName: 'String!',
                publicName: 'String',
                attributes: 'JSON!', // Replace category with attributes
                description: 'String!'
            },
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");
                const setID = (await Set.findOne({name: args.setName}))?._id?.toString();
                if (!setID) throw new Error("Set name not found, be exact");
                return "added: " + await createRole(context.user._id.toString(), args.roleName, args.publicName, args.role, setID, args.attributes, args.description);
            }
        });

        RoleTC.addResolver({
            name: "publishrole",
            type: 'String',
            args: {
                roleId: 'String!',
            },
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");
                const role = await Role.findById(args.roleId);
                role.visibility = true;
                await role.save()
                return "published";
            }
        });

        RoleTC.addResolver({
            name: "getPublicRoles",
            type: [RoleTC],
            args: {},
            resolve: async () => Role.find({visibility: true})
        });
    }

    return RoleTC;
};