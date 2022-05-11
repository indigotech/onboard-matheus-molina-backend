import * as jwt from "jsonwebtoken";
import { CustomError } from "../errors/login-error-class";

interface DecodedPayload {
  id: number;
  name: string;
  iat: number;
  exp: number;
}

export function verifyToken(
  token: string,
  key: string
): DecodedPayload | undefined {
  try {
    const decoded = jwt.verify(token, key) as DecodedPayload;
    return { ...decoded };
  } catch (error: any) {
    throw new CustomError(401, "Invalid Token", error.message);
  }
}
