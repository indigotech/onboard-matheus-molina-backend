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

  input LoginInput {
    email: String
    password: String
  }

  type LoginType {
    user: User
    token: String
  }

  type Mutation {
    createUser(data: UserInput!): User
  }

  type Mutation {
    login(data: LoginInput!): LoginType
  }
`;
