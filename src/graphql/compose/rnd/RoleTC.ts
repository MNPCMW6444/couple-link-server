import {composeWithMongoose} from 'graphql-compose-mongoose';
import {safeResolvers} from "../../schema";
import roleModel from "../../../mongo/rnd/roleModel";
import {createRole} from "../../../ai/ai";

let RoleTC;

export default () => {
    if (!RoleTC) {


        const Role = roleModel();

        try {
            RoleTC = composeWithMongoose(Role);
        } catch (e) {
            RoleTC = composeWithMongoose(Role, {resolvers: safeResolvers, name: "newrole"});
        }

        RoleTC.addResolver({
            name: 'getroles',
            type: [RoleTC],
            args: {},
            resolve: async ({context}) => {
                if (!context.user) throw new Error("Please sign in first");
                return Role.find();
            }

        });

        RoleTC.addResolver({
            name: 'addrole',
            type: 'String',
            args: {
                role: 'String!'
            },
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");
                return "added: " + await createRole(context.user._id.toString(),args.role);
            }

        });
    }

    return RoleTC;
}
;
