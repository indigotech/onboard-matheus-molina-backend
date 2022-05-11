import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const isRepeatedEmail = async (inputEmail: string) => {
  const registeredEmailUser = await AppDataSource.manager.findOneBy(User, {
    email: inputEmail,
  });
  return !!registeredEmailUser;
};
