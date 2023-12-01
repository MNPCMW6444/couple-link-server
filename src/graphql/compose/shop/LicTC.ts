import {composeWithMongoose} from 'graphql-compose-mongoose';
import {safeResolvers} from "../../schema";
import licModel from "../../../mongo/lic/licModel";
import RoleTC from "../rnd/RoleTC";
import RoleModel from "../../../mongo/rnd/roleModel";

let LicTC;

export default () => {
    if (!LicTC) {
        const Lic = licModel();
        try {
            LicTC = composeWithMongoose(Lic);
        } catch (e) {
            LicTC = composeWithMongoose(Lic, {resolvers: safeResolvers, name: "newlic"});
        }

        LicTC.addResolver({
            name: 'buy',
            type: 'Boolean',
            args: {
                id: 'String!',
            },
            resolve: async ({context, args}) => {
                if (!context.user) throw new Error("Please sign in first");
                if (!context.user) throw new Error("Please sign in first");
                const lis = new Lic({userId: context.user._id.toString(), roleId: args.id, active: true});
                await lis.save();
                return true
            }
        });

        LicTC.addResolver({
            name: 'geyMyInventory',
            type: [RoleTC],
            args: {},
            resolve: async ({context}) => {
                if (!context.user)      throw new Error("Please sign in first");
                const lis = await Lic.find({userId: context.user._id.toString(), active: true});
                const roles = lis.map((lic) => RoleModel().findById(lic.roleId))
                return Promise.all(roles)
            }
        });

    }
    return LicTC;
}
;
