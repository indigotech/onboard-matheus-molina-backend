import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { CustomError } from "../errors/login-error-class";
import { validatePassword } from "../validators/password-validator";
import { CreateUserInput } from "./create-user.use-case";

interface LoginInput {
  email: string;
  password: string;
}
export async function login(input: LoginInput) {
  const registeredEmailUser = await AppDataSource.manager.findOneBy(User, {
    email: input.email,
  });
  const isValidPassword = validatePassword(input.password);

  const token = jwt.sign({ name: input.name }, "secretKey", {
    expiresIn: 1200,
  });

  if (!isValidPassword) {
    throw new CustomError(
      400,
      "The password must contain at least 6 characters, of which 1 must be a letter and 1 a digit"
    );
  }

  if (!registeredEmailUser) {
    throw new CustomError(400, "Email not found");
  }

  const { salt } = registeredEmailUser!;
  const hash = crypto.createHash("sha256");
  hash.update(salt + input.password);
  const hashedPassword = hash.digest("hex");

  if (hashedPassword === registeredEmailUser?.password) {
    return { user: registeredEmailUser, token: token };
  } else {
    throw new CustomError(401, "Wrong Email and/or Paassword");
  }
}

export const mock_logged_user = {
  user: {
    id: 12,
    name: "User Name",
    email: "User e-mail",
    birthDate: "04-25-1990",
  },
  token: "the_token",
};
