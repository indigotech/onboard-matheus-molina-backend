import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const isRepeatedEmail = async (email: string) => {
  const users = await AppDataSource.manager.find(User);
  const repeatedEmail = users.filter((user) => user.email === email );
  return !!repeatedEmail.length
};
