import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone'
import jsonwebtoken from "jsonwebtoken";
import settings from "../settings";
import userModel from "../mongo/auth/userModel";
import {GraphQLError} from "graphql/error";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: () => books,
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const serverSetup = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
export default async () => {
    const {url} = await startStandaloneServer(serverSetup, {
        listen: {port: 6005},
        // Note: This example uses the `req` argument to access headers,
        // but the arguments received by `context` vary by integration.
        // This means they vary for Express, Fastify, Lambda, etc.

        // For `startStandaloneServer`, the `req` and `res` objects are
        // `http.IncomingMessage` and `http.ServerResponse` types.
        context: async ({req, res}) => {
            const token = req.headers.authorization || '';
            const decoded = jsonwebtoken.verify(token, settings.jwtSecret)
            const user = typeof decoded !== 'string' && 'id' in decoded && (await userModel().findById(decoded.id));
            if (!user) throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: {status: 401},
                },
            });
            return {user};
        },
    });

    console.log(`Apollo is listening at: ${url}`);
}


