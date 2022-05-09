import { hashPassword } from "./cryptography/password-encription";
import { AppDataSource } from "./data-source";
import { books } from "./database";
import { User } from "./entity/User";
import { CustomError } from "./errors/login-error-class";
import { createUser } from "./mutation/create-user.use-case";
import { isRepeatedEmail } from "./validators/email-validator";
import { validatePassword } from "./validators/password-validator";

export const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createUser: async (_: any, { data }: any) => createUser(data),
  },
};
