import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import schema from "./schema";
import jsonwebtoken from "jsonwebtoken";
import settings from "../settings";
import userModel from "../mongo/auth/userModel";
import cors from 'cors';
import cookieParser from "cookie-parser";
import * as http from "http";
import {SubscriptionServer} from 'subscriptions-transport-ws';
import {execute, subscribe} from 'graphql';
//import {RedisPubSub} from "graphql-redis-subscriptions";
import subscriptions from "./subscriptions";
import {PubSub} from "graphql-subscriptions";
import stripeHandler from "../stripe/index"

//export const pubsub = new RedisPubSub();
export const pubsub = new PubSub();


export default async () => {
    if (!schema) throw new Error("No schema");
    const schemaX = await schema();
    const app = express();
    app.use(cors({
        credentials: true,
        origin: [settings.clientDomain, ...(settings.whiteEnv !== "local" ? [] : ["https://studio.apollographql.com"])]
    }));
    app.use(cookieParser());

    app.post('/stripe',express.raw({type: 'application/json'}), stripeHandler);

    const server = new ApolloServer({
        schema: schemaX,
        context: async ({req, res}) => {
            let token = req.cookies?.jwt || null;
            let decoded = null;
            try {
                decoded = token ? jsonwebtoken.verify(token, settings.jwtSecret) : null;
            } catch (err) {
            }
            if (typeof decoded !== 'object' || !decoded?.id) {
                return {req, res, user: null};
            }
            const user = decoded ? await userModel().findById(decoded.id) : null;
            return {req, res, user: user || null, pubsub};
        },
        introspection: settings.whiteEnv === "local",
        persistedQueries: false,
        plugins: [{
            async serverWillStart() {
                return {};
            }
        }],

    });
    await server.start();
    server.applyMiddleware({app, cors: false});


    const httpServer = http.createServer(app);
    httpServer.listen(6005, () => {
        console.log(`🚀 Server ready at http://localhost:6005${server.graphqlPath}`);
    });

    SubscriptionServer.create(
        {
            schema: schemaX,
            execute,
            subscribe,
        },
        {
            server: httpServer,
            path: server.graphqlPath,
        }
    );

    subscriptions();


};

