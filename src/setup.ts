import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { ConfigAppDataSource } from "./data-source";
import { GraphQLError } from "graphql";
import { formatError } from "./errors/erorr-handler";

export async function setup() {
  await ConfigAppDataSource();

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const { url } = await server.listen(parseInt(process.env.SERVER_PORT!));
  console.log(`🚀 Server ready at ${url}`);
}
