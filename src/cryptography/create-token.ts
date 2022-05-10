import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";

export function generateToken(user: User, key: string, expirationTime: number | string) {
  const token = jwt.sign(
    {  id: user.id },
    key,
    {
      expiresIn: expirationTime,
    }
  );
  return token
}
