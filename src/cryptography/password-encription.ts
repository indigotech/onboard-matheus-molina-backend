import * as crypto from 'crypto'

export function hashPassword({
  password,
  algorithm,
}: {
  password: string;
  algorithm: string;
}) {
  const hash = crypto.createHash(algorithm);
  hash.update(password);
  const hashedPassword = hash.digest("hex");
  console.log(hashedPassword);
  return hashedPassword;
}
