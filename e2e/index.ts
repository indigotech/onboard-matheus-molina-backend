import * as dotenv from "dotenv";
import { before, describe } from "mocha";
import { generateToken } from "../src/cryptography/create-token";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import { CreateUserInput } from "../src/mutation/create-user.use-case";
import { setup } from "../src/setup";
import { saveUserToDB } from "./save-user-to-db";

export const TEST_VARIABLE: CreateUserInput = {
  name: "john-doe",
  email: "john-doe@email.com",
  password: "passw0rd",
  birthDate: "00-00-0000",
};

describe("Test", async () => {
  let token: string;
  let testUser: User;

  before(async () => {
    dotenv.config({ path: __dirname + "/../test.env" });
    await setup();
  });

  beforeEach(async () => {
    await AppDataSource.manager.clear(User);
    testUser = await saveUserToDB();
    token = generateToken(testUser, "secretKey", 1200);
  });

  describe("Login Test", async () => {
    require('./scripts/login-script');
  });

  describe("CreateUser Test", async () => {
    require('./scripts/create-user-script');
  });

  describe("GetUser Test", async () => {
    require('./scripts/get-user-script')
  });
});
