import { AppDataSource } from "./data-source";
import { books } from "./database";
import { User } from "./entity/User";

export const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createUser: async (_: any, { data }: any) => {
      const newUser = new User();
      newUser.firstName = data.name;
      newUser.birthDate = data.birthDate;
      newUser.email = data.email;
      await AppDataSource.manager.save(newUser);
      return newUser;
    },
  },
};

export const MOCK_USER = {
  id: 1,
  name: "Joshua",
  email: "User e-mail",
  birthDate: "01-01-1990",
};
