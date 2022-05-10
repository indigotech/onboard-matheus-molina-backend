import * as jwt from "jsonwebtoken";

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
  } catch (err) {
    console.log(err);
  }
}
