import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { ConfigAppDataSource } from "./data-source";

export async function setup() {
  await ConfigAppDataSource();

  const server = new ApolloServer({ typeDefs, resolvers });

  server
    .listen(parseInt(process.env.ENV_SERVER_PORT!))
    .then(async ({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
}
