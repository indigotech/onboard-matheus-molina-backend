import { verifyToken } from "../cryptography/verify-token";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { CustomError } from "../errors/login-error-class";
import { isAuthorized } from "../validators/authorization-validator";

export async function getUser(id: number, token: string) {
  const decoded = await verifyToken(token, "secretKey");
  const authorized = await isAuthorized(decoded!.id);

  if (!authorized) {
    throw new CustomError(401, "User Unauthorized, please create User");
  }

  const requestedUser = await AppDataSource.manager.findOneBy(User, { id: id });
  if(!requestedUser){
    throw new CustomError(400, 'No User with given Id')
  }
  return requestedUser;
}
