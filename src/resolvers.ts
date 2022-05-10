import { books } from "./database";
import { createUser } from "./mutation/create-user.use-case";
import { login } from "./mutation/login.use-case";

export const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createUser: async (_: any, { data }: any) => createUser(data),
    login: async (_: any, { data }: any) => login(data),
  },
};
