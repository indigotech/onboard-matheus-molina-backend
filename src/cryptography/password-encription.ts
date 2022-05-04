import * as crypto from "crypto";

export function hashPassword({
  password,
  algorithm,
}: {
  password: string;
  algorithm: string;
}) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash(algorithm);
  hash.update(salt + password);
  const hashedPassword = hash.digest("hex");
  return { hashedPassword, salt };
}
