import { AppDataSource } from "./data-source";
import { books } from "./database";
import { User } from "./entity/User";
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
        throw new Error(
          "The password must contain at least 6 characters, of which 1 must be a letter and 1 a digit"
        );
      }
      if (repeatedEmail) {
        throw new Error(
          "This email has already been registered by another user"
        );
      }
      
      const newUser = new User();
      newUser.firstName = data.name;
      newUser.birthDate = data.birthDate;
      newUser.email = data.email;
      await AppDataSource.manager.save(newUser);
      return newUser;
    },
  },
};
