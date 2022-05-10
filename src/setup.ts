import { ApolloServer } from "apollo-server";
import { ConfigAppDataSource } from "./data-source";
import { formatError } from "./errors/erorr-handler";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

export async function setup() {
  await ConfigAppDataSource();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: formatError,
    context: ({ req }) => ({
      authorization: req.headers.authorization,
    }),
  });

  const { url } = await server.listen(parseInt(process.env.SERVER_PORT!));
  console.log(`🚀 Server ready at ${url}`);
}
