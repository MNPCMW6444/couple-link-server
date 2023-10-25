import express from 'express';
import {ApolloServer, AuthenticationError} from 'apollo-server-express';
import schema from "./schema";
import jsonwebtoken from "jsonwebtoken";
import settings from "../settings";
import userModel from "../mongo/auth/userModel";

export default async () => {


    const server = new ApolloServer({
        schema: schema(),
        context: async ({req, res}) => {


            let token;

            // Attempt to extract token from Authorization header first
            const authHeader = req.headers.authorization;

            if (authHeader) {

                token = authHeader.split('Bearer ')[1];
                if (!token) {
                    token = null;

                }
            }
            // If not in header, then attempt to extract from cookie
            else if (req.cookies && req.cookies.jwt) {

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
        },
        introspection: settings.env === "local",  // Ensure introspection is on, especially if in production mode
    });

    const app = express();

    await server.start()
    server.applyMiddleware({app, path: '/'});

    app.listen({port: 6005}, () =>
        console.log(`🚀 Server ready at http://localhost:6005${server.graphqlPath}`)
    );
}
