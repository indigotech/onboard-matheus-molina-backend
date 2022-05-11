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

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
//Successfull cases
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

describe("Test of Success", async () => {
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

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
//Failing cases
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

describe("Test of Failure", async () => {
  let token: string;
  let TestUser: User;

  beforeEach(async () => {
    await AppDataSource.manager.clear(User);
    TestUser = await saveUserToDB();
    token = generateToken(TestUser, "secretKey", 1200);
  });

  it("Should Fail Login Because Wrong Password Input", async () => {
    const response = await testLogin({
      email: TestUser.email,
      password: TEST_USER.password + "a",
    });

    const errors = response.data.errors;
    expect(errors[0].code).to.be.equal(401);
  });

  it("Should Fail to Create User Because Email Already Registered", async () => {
    const FAILING_TEST_USER = { ...TEST_VARIABLE, email: TEST_USER.email };

    const response = await testCreateUserMutation(FAILING_TEST_USER, token);

    expect(response.data.errors).to.be.deep.equal([
      {
        code: 400,
        message: "This email has already been registered by another user",
      },
    ]);
  });

  it("Should Fail to Create User Because Wrong Password Format", async () => {
    const FAILING_TEST_USER = { ...TEST_VARIABLE, password: "password" };

    const response = await testCreateUserMutation(FAILING_TEST_USER, token);

    expect(response.data.errors).to.be.deep.equal([
      {
        code: 400,
        message:
          "The password must contain at least 6 characters, of which 1 must be a letter and 1 a digit",
      },
    ]);
  });

  it("Should Fail to Create User Because token non authenticated", async () => {
    const response = await testCreateUserMutation(TEST_VARIABLE, "token");
    expect({
      message: response.data.errors[0].message,
      code: response.data.errors[0].code,
    }).to.be.deep.equal({
      message: "Invalid Token",
      code: 401,
    });
  });

  it("Should Not Get User By Id Because No such Id Exists", async () => {
    const response = await testGetUserQuery(0, token);

    expect(response.data.errors).to.deep.include({
      message: "No User with given Id",
      code: 400,
    });
  });

  it("Should Not Get User By Id Because Non Authenticated", async () => {
    const response = await testGetUserQuery(TestUser.id, "token");

    expect({
      message: response.data.errors[0].message,
      code: response.data.errors[0].code,
    }).to.be.deep.equal({
      message: "Invalid Token",
      code: 401,
    });
  });
});
