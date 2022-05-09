import * as crypto from "crypto";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

interface LoginInput {
  email: string;
  password: string;
}
export async function login(input: LoginInput) {
  const registeredEmailUser = await AppDataSource.manager.findOneBy(User, {
    email: input.email,
  });
  const { salt } = registeredEmailUser!;

  const hash = crypto.createHash("sha256");
  hash.update(salt + input.password);
  const hashedPassword = hash.digest("hex");

  if (hashedPassword === registeredEmailUser?.password) {
    return { user: registeredEmailUser, token: "" };
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
