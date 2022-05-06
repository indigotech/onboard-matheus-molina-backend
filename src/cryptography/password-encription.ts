import * as crypto from "crypto";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256");
  hash.update(salt + password);
  const hashedPassword = hash.digest("hex");
  return { hashedPassword, salt };
}
