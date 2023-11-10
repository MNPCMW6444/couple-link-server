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
            name: 'getrole',
            type: [RoleTC],
            args: {},
            resolve: async ({context}) => {
                if (!context.user || (!(context.user.phone !== "972528971871" && context.user.phone !== "972527820055"))) throw new Error("Please sign in first");
                return Role.find();
            }

        });

        RoleTC.addResolver({
            name: 'addRole',
            type: 'String',
            args: {
                role: 'String!'
            },
            resolve: async ({context, args}) => {
                if (!context.user || (!(context.user.phone !== "972528971871" && context.user.phone !== "972527820055"))) throw new Error("Please sign in first");
                return "added: " + await createRole(args.role);
            }

        });
    }

    return RoleTC;
}
;
