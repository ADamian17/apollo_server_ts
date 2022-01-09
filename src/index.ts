/* == External modules == */
import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

/* == Internal modules == */
import { schema } from './schema';

/* == PORT == */
const PORT = process.env.PORT || 3000;

export const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
});

// ctrl + cmd + space emojis
server
  .listen({ port: PORT })
  .then(({ url }) => console.log(`🚀 server ready at ${url}`))