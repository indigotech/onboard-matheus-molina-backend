import { expect } from "chai";
import * as dotenv from "dotenv";
import { before, describe, it } from "mocha";
import { generateToken } from "../src/cryptography/create-token";
import { verifyToken } from "../src/cryptography/verify-token";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import { CreateUserInput } from "../src/mutation/create-user.use-case";
import { setup } from "../src/setup";
import { testCreateUserMutation } from "./mutations/create-user-test";
import { testLogin } from "./mutations/login-test";
import { testGetUserQuery } from "./query/get-user-test";
import { saveUserToDB, TEST_USER } from "./save-user-to-db";

const TEST_VARIABLE: CreateUserInput = {
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
    await AppDataSource.manager.clear(User);
    TestUser = await saveUserToDB();
    token = generateToken(TestUser, "secretKey", 1200);
  });

  it("Should Login Succesfully", async () => {
    const response = await testLogin({
      email: TestUser.email,
      password: TEST_USER.password,
    });

    const { token: responseToken, user } = response.data.data.login;

    expect(responseToken).to.be.a("string");

    const decoded = verifyToken(token, "secretKey");

    expect({ id: decoded?.id }).to.be.deep.equal({ id: user.id });

    expect(user).to.be.deep.equal({
      id: TestUser.id,
      name: TestUser.name,
      email: TestUser.email,
      birthDate: TestUser.birthDate,
    });
  });

  it("Should Create User", async () => {
    const response = await testCreateUserMutation(TEST_VARIABLE, token);

    const { id, ...otherFields } = response.data.data.createUser;
    const { password, ...inputOtherFields } = TEST_VARIABLE;

    expect(otherFields).to.be.deep.equal(inputOtherFields);

    expect(id).to.be.a("number");
  });

  it("Should Get User By Id", async () => {
    const response = await testGetUserQuery(TestUser.id, token);

    expect(response.data.data.getUser).to.be.deep.equal({
      id: TestUser.id,
      name: TestUser.name,
      email: TestUser.email,
      birthDate: TestUser.birthDate,
    });
  });
});
