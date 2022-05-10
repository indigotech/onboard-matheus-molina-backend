import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export async function isAuthorized(id: number) {
  const registeredUser = await AppDataSource.manager.findOneBy(User, {
    id: id,
  });
  return !!registeredUser;
}
