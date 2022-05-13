import { verifyToken } from "../cryptography/verify-token";
import { CustomError } from "../errors/login-error-class";
import { isAuthorized } from "../validators/authorization-validator";

export async function checkToken(token: string) {
  const decoded = await verifyToken(token, "secretKey");
  const authorized = await isAuthorized(decoded!.id);

  if (!authorized) {
    throw new CustomError(401, "User Unauthorized, please create User");
  }
}
