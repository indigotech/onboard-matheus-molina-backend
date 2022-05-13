import * as crypto from "crypto";
import { generateToken } from "../cryptography/create-token";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { CustomError } from "../errors/login-error-class";
import { validatePassword } from "../validators/password-validator";

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}
export async function login(input: LoginInput) {
  const registeredEmailUser = await AppDataSource.manager.findOneBy(User, {
    email: input.email,
  });

  if (!registeredEmailUser) {
    throw new CustomError(400, "Email not found");
  }

  const isValidPassword = validatePassword(input.password);

  const expirationTime = input.rememberMe ? "7d" : 1200;

  const token = generateToken(
    registeredEmailUser!,
    "secretKey",
    expirationTime
  );

  if (!isValidPassword) {
    throw new CustomError(
      400,
      "The password must contain at least 6 characters, of which 1 must be a letter and 1 a digit"
    );
  }

  const { salt } = registeredEmailUser!;
  const hash = crypto.createHash("sha256");
  hash.update(salt + input.password);
  const hashedPassword = hash.digest("hex");

  if (hashedPassword === registeredEmailUser?.password) {
    return { user: registeredEmailUser, token: token };
  } else {
    throw new CustomError(401, "Wrong Email and/or Password");
  }
}
