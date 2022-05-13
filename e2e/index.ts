import { expect } from "chai";
import * as dotenv from "dotenv";
import { before, describe } from "mocha";
import { generateToken } from "../src/cryptography/create-token";
import { AppDataSource } from "../src/data-source";
import { Address } from "../src/entity/address";
import { User } from "../src/entity/User";
import { CreateUserInput } from "../src/mutation/create-user.use-case";
import { setup } from "../src/setup";
import { saveUserToDB } from "./save-user-to-db";
import { CreateUserTest } from "./scripts/create-user-script";
import { GetUserListTest } from "./scripts/get-user-list-script";
import { GetUserTest } from "./scripts/get-user-script";
import { LoginTest } from "./scripts/login-script";

export const TEST_VARIABLE: CreateUserInput = {
  name: "john-doe",
  email: "john-doe@email.com",
  password: "passw0rd",
  birthDate: "00-00-0000",
};

describe("Test", async () => {
  let token: string;
  let TestUser: User;

  before(async () => {
    dotenv.config({ path: __dirname + "/../test.env" });
    await setup();
  });

  beforeEach(async () => {
    await AppDataSource.manager.delete(Address, {});
    await AppDataSource.manager.delete(User, {});
    TestUser = await saveUserToDB();
    token = generateToken(TestUser, "secretKey", 1200);
  });

  describe("Login Test", async () => {
    await LoginTest();
  });

  describe("CreateUser Test", async () => {
    await CreateUserTest();
  });

  describe("GetUser Test", async () => {
    await GetUserTest();
  });
  describe("Get UserList Test", async () => {
    await GetUserListTest()
  });

  describe("Create Address in Database with relation to user", async () => {
    it("Should create 2 adresses with userId equal to TestUser.id", async () => {
      const addresses = await AppDataSource.manager.findBy(Address, {
        user: TestUser,
      });
      expect(addresses.length).to.be.eq(2);
    });
  });
});
