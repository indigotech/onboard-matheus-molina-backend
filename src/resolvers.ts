import { hashPassword } from "./cryptography/password-encription";
import { AppDataSource } from "./data-source";
import { books } from "./database";
import { User } from "./entity/User";
import { CustomError } from "./errors/login-error-class";
import { isRepeatedEmail } from "./validators/email-validator";
import { validatePassword } from "./validators/password-validator";

export const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createUser: async (_: any, { data }: any) => {
      const validPassword = validatePassword(data.password);
      const repeatedEmail = await isRepeatedEmail(data.email);

      if (!validPassword) {
        throw new CustomError(
          400,
          "The password must contain at least 6 characters, of which 1 must be a letter and 1 a digit"
        );
      }
      if (repeatedEmail) {
        throw new CustomError(
          400,
          "This email has already been registered by another user"
        );
      }

      const hashedPassword = hashPassword(data.password);

      const newUser = new User();
      newUser.name = data.name;
      newUser.birthDate = data.birthDate;
      newUser.email = data.email;
      newUser.password = hashedPassword.hashedPassword;
      newUser.salt = hashedPassword.salt;
      await AppDataSource.manager.save(newUser);
      return newUser;
    },
  },
};
