import { expect } from "chai";
import { generateToken } from "../../src/cryptography/create-token";
import { AppDataSource } from "../../src/data-source";
import { User } from "../../src/entity/User";
import { TEST_VARIABLE } from "../index";
import { testCreateUserMutation } from "../mutations/create-user-test";
import { saveUserToDB, TEST_USER } from "../save-user-to-db";

describe("CreateUser Mutation Scenario", () => {
  let token: string;
  let testUser: User;
  beforeEach(async () => {
    await AppDataSource.manager.clear(User);
    testUser = await saveUserToDB();
    token = generateToken(testUser, "secretKey", 1200);
  });

  it("Should create user", async () => {
    const response = await testCreateUserMutation(TEST_VARIABLE, token);

    const { id, ...otherFields } = response.data.data.createUser;
    const { password, ...inputOtherFields } = TEST_VARIABLE;

    const createdUser = await AppDataSource.manager.findOneBy(User, {
      id,
    });

    expect(otherFields).to.be.deep.equal(inputOtherFields);

    expect(id).to.be.a("number");

    expect(response.data.data.createUser).to.be.deep.eq({
      name: createdUser?.name,
      email: createdUser?.email,
      id: createdUser?.id,
      birthDate: createdUser?.birthDate,
    });
  });

  it("Should fail to create User because email already registered", async () => {
    const failingTestUser = { ...TEST_VARIABLE, email: TEST_USER.email };

    const response = await testCreateUserMutation(failingTestUser, token);

    expect(response.data.errors).to.be.deep.equal([
      {
        code: 400,
        message: "This email has already been registered by another user",
      },
    ]);
  });

  it("Should fail to create User because no digit in password", async () => {
    const failingTestUser = { ...TEST_VARIABLE, password: "password" };

    const response = await testCreateUserMutation(failingTestUser, token);

    expect(response.data.errors).to.be.deep.equal([
      {
        code: 400,
        message:
          "The password must contain at least 6 characters, of which 1 must be a letter and 1 a digit",
      },
    ]);
  });

  it("Should fail to create User because no letter in password", async () => {
    const failingTestUser = { ...TEST_VARIABLE, password: "123456" };

    const response = await testCreateUserMutation(failingTestUser, token);

    expect(response.data.errors).to.be.deep.equal([
      {
        code: 400,
        message:
          "The password must contain at least 6 characters, of which 1 must be a letter and 1 a digit",
      },
    ]);
  });

  it("Should fail to create User because password is shorter than 6 characters", async () => {
    const failingTestUser = { ...TEST_VARIABLE, password: "s3nh4" };

    const response = await testCreateUserMutation(failingTestUser, token);

    expect(response.data.errors).to.be.deep.equal([
      {
        code: 400,
        message:
          "The password must contain at least 6 characters, of which 1 must be a letter and 1 a digit",
      },
    ]);
  });

  it("Should fail to create User because token non authenticated", async () => {
    const response = await testCreateUserMutation(TEST_VARIABLE, "token");

    const error = {
      message: response.data.errors[0].message,
      code: response.data.errors[0].code,
    };

    expect(error).to.be.deep.equal({
      message: "Invalid Token",
      code: 401,
    });
  });
});
