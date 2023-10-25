import express from 'express';
import {ApolloServer, AuthenticationError} from 'apollo-server-express';
import schema from "./schema";
import jsonwebtoken from "jsonwebtoken";
import settings from "../settings";
import userModel from "../mongo/auth/userModel";
import cors from 'cors';
import cookieParser  from "cookie-parser"
export default async () => {


    const server = new ApolloServer({
        schema: schema(),
        context: async ({req, res}) => {


            let token;


            if (req.cookies && req.cookies.jwt) {
                token = req.cookies.jwt;
            } else {
                token = null;
            }
            let decoded;
            try {
                decoded = token ? jsonwebtoken.verify(token, settings.jwtSecret) : null;
            } catch (err) {
                decoded = null;
            }
            if (typeof decoded !== 'object' || !decoded?.id) {
                return {req, res, user: null};
            }
            const user = await userModel().findById(decoded.id);
            if (!user) {
                return {req, res, user: null};
            }
            return {req, res, user};
        }, introspection: settings.env === "local",
    });

    const app = express();

    app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
    app.use(cookieParser());

    await server.start()
    server.applyMiddleware({app, path: '/', cors: false});

    app.listen({port: 6005}, () =>
        console.log(`🚀 Server ready at http://localhost:6005${server.graphqlPath}`)
    );
}
