import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { hashPassword } from "../cryptography/password-encription";
import { AppDataSource, ConfigAppDataSource } from "../data-source";
import { Address } from "../entity/address";
import { User } from "../entity/User";

export async function populateDB() {
  let UserList: User[] = [];
  for (let i = 0; i < 50; i++) {
    const newUser = new User();
    newUser.name = faker.name.firstName();
    newUser.email = faker.internet.email(newUser.name);

    newUser.birthDate = faker.date
      .between("1950-01-01T00:00:00.000Z", "2010-01-01T00:00:00.000Z")
      .toJSON()
      .substring(0, 10);

    const { hashedPassword, salt } = hashPassword("p4ssw0rd");
    newUser.password = hashedPassword;
    newUser.salt = salt;

    const address = new Address();
    address.cep = faker.address.zipCode("######");
    address.city = faker.address.city();
    address.complement = "";
    address.neighborhood = newUser.name + " neighborhood";
    address.state = faker.address.state();
    address.street = faker.address.streetName();

    newUser.addresses = [address]

    UserList.push(newUser);
    await AppDataSource.manager.save(address)
  }
  await AppDataSource.manager.save(UserList);
}
