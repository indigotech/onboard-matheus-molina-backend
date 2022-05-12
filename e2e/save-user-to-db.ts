import { hashPassword } from "../src/cryptography/password-encription";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";

export const TEST_USER = {
  birthDate: "00-00-0000",
  email: "Test-email@email.com",
  name: "Test User",
  password: "p4ssw0rd",
};

export async function saveUserToDB() {
  const TestUser = new User();
  const { hashedPassword, salt } = hashPassword(TEST_USER.password);
  TestUser.birthDate = TEST_USER.birthDate;
  TestUser.email = TEST_USER.email;
  TestUser.name = TEST_USER.name;
  TestUser.password = hashedPassword;
  TestUser.salt = salt;

  await AppDataSource.manager.save(TestUser);
}
