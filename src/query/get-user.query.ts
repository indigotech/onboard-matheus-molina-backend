import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { CustomError } from "../errors/login-error-class";
import { checkToken } from "../utils/check-token";

export async function getUser(id: number, token: string) {
  await checkToken(token);

  const requestedUser = await AppDataSource.manager.findOne(User, {
    relations: { addresses: true },
    where: {
      id: id,
    },
  });
  if (!requestedUser) {
    throw new CustomError(400, "No User with given Id");
  }

  return requestedUser;
}
