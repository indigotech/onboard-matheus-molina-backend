import { books } from "./database";

export const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createUser: (data: any) => MOCK_USER,
  },
};

export const MOCK_USER = {
  id: 1,
  name: "Joshua",
  email: "User e-mail",
  birthDate: "01-01-1990",
};
