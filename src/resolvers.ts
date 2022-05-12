import { books } from "./database";
import { createUser } from "./mutation/create-user.use-case";
import { login } from "./mutation/login.use-case";
import { getUser } from "./query/get-user.query";
import { getUserList } from "./query/get-users.query";

export const resolvers = {
  Query: {
    books: () => books,

    getUser: async (_: any, { data }: any, context: any) =>
      getUser(data.id, context.authorization),

    getUserList: async (_: any, { data }: any, context: any) =>
      getUserList(context.authorization, data),
  },
  Mutation: {
    createUser: async (_: any, { data }: any, context: any) =>
      createUser(data, context.authorization),
    login: async (_: any, { data }: any) => login(data),
  },
};
