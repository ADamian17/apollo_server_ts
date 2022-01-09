/* == External modules == */
import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import * as dotenv from "dotenv"

/* == Internal modules == */
import { schema } from './schema';
import { context } from "./context";

dotenv.config();

/* == PORT == */
const PORT = process.env.PORT || 3000;

export const server = new ApolloServer({
  schema,
  context,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
});

// ctrl + cmd + space emojis
server
  .listen({ port: PORT })
  .then(({ url }) => console.log(`🚀 server ready at ${url}`));
