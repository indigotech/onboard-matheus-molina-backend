import { gql } from "apollo-server";

export const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  input GetUserInput {
    id: Int
  }

  type Query {
    getUser(data: GetUserInput!): User
  }

  type Query {
    books: [Book]
  }

  input GetUserListInput {
    limit: Int
    page: Int
  }

  type UserList {
    users: [User]
    page: Int
    hasNextPage: Boolean
    hasPreviousPage: Boolean
  }

  type Query {
    getUserList(data: GetUserListInput): UserList
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
    rememberMe: Boolean
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
