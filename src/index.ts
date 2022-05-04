import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

AppDataSource.initialize()
  .catch((error) => console.log(error));

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(async ({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
