import { gql } from "apollo-server";

export const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }

  input UserInput {
    email: String
    name: String
    birthDate: String
    password: String
  }

  type User {
    id: Int
    email: String
    name: String
    birthDate: String
  }

  type Mutation {
    createUser(data: UserInput!): User
  }
`;
