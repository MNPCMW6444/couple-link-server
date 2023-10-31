import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import http from 'http';
import schema from "./schema";
import jsonwebtoken from "jsonwebtoken";
import settings from "../settings";
import userModel from "../mongo/auth/userModel";
import cors from 'cors';
import cookieParser from "cookie-parser";
import subscriptions from "./subscriptions";

export default async () => {
    if (!schema) throw new Error("No schema");

    const app = express();

    app.use(cors({
        credentials: true,
        origin: settings.env === "prod" ? ["https://scailean.com"] : ['http://localhost:5173', "https://studio.apollographql.com"]
    }));
    app.use(cookieParser());

    const server = new ApolloServer({
        schema: schema(),
        context: async ({ req, res }) => {
            let token = req.cookies?.jwt || null;
            let decoded = null;
            try {
                decoded = token ? jsonwebtoken.verify(token, settings.jwtSecret) : null;
            } catch (err) { }
            if (typeof decoded !== 'object' || !decoded?.id) {
                return { req, res, user: null };
            }
            const user = decoded ? await userModel().findById(decoded.id) : null;
            return { req, res, user: user || null };
        },
        introspection: settings.env === "local",
        plugins: [{
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    }
                };
            }
        }],
    });

    await server.start();
    server.applyMiddleware({ app, path: '/', cors: false });

    const httpServer = http.createServer(app);
    const subscriptionServer = SubscriptionServer.create(
        { schema: schema(), execute, subscribe },
        { server: httpServer, path: server.graphqlPath }
    );

    httpServer.listen(6005, () => {
        console.log(`🚀 Server ready at http://localhost:6005${server.graphqlPath}`);
        console.log(`🚀 Subscriptions ready at ws://localhost:6005${server.graphqlPath}`);
        subscriptions();
    });
};
