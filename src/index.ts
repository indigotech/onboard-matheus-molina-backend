import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

AppDataSource.initialize()
  .then(async () => {
    console.log("Loading users from the database...");
    const users = await AppDataSource.manager.find(User);
    console.log("Loaded users: ", users);
  })
  .catch((error) => console.log(error));

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(async ({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
