import { books } from "./database";

export const resolvers = {
  Query: {
    books: () => books,
  },
};
