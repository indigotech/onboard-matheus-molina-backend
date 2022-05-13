import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { hashPassword } from "../cryptography/password-encription";
import { AppDataSource, ConfigAppDataSource } from "../data-source";
import { User } from "../entity/User";

let UserList: User[] = [];
dotenv.config();

async function populateDB() {
  await ConfigAppDataSource();
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

    UserList.push(newUser);
  }
  await AppDataSource.manager.save(UserList);
}

populateDB();
