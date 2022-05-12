import { hashPassword } from "../src/cryptography/password-encription";
import { AppDataSource } from "../src/data-source";
import { Address } from "../src/entity/address";
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

  const addres1 = new Address();
  addres1.cep = "123456789";
  addres1.city = "city 1";
  addres1.neighborhood = "neighborhood 1";
  addres1.state = "State";
  addres1.street = "street 1";

  const addres2 = new Address();
  addres2.cep = "987654321";
  addres2.city = "city 1";
  addres2.neighborhood = "neighborhood 2";
  addres2.state = "State";
  addres2.street = "street 2";

  TestUser.addresses = [addres1, addres2];
  await AppDataSource.manager.save([addres1, addres2])

  await AppDataSource.manager.save(TestUser);
  return TestUser;
}
