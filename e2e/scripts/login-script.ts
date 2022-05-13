import { expect } from "chai";
import { describe } from "mocha";
import { generateToken } from "../../src/cryptography/create-token";
import { verifyToken } from "../../src/cryptography/verify-token";
import { AppDataSource } from "../../src/data-source";
import { User } from "../../src/entity/User";
import { testLogin } from "../mutations/login-test";
import { saveUserToDB, TEST_USER } from "../save-user-to-db";

describe("Login Mutation Scenario", () => {
  let token: string;
  let TestUser: User;
  beforeEach(async () => {
    await AppDataSource.manager.clear(User);
    TestUser = await saveUserToDB();
    token = generateToken(TestUser, "secretKey", 1200);
  });

  it("Should Login succesfully", async () => {
    const response = await testLogin({
      email: TestUser.email,
      password: TEST_USER.password,
    });

    const { token: responseToken, user } = response.data.data.login;

    const decoded = verifyToken(token, "secretKey");

    expect(responseToken).to.be.a("string");

    expect({ id: decoded?.id }).to.be.deep.equal({ id: user.id });

    expect(user).to.be.deep.equal({
      id: TestUser.id,
      name: TestUser.name,
      email: TestUser.email,
      birthDate: TestUser.birthDate,
    });
  });

  it("Should fail Login because wrong password input", async () => {
    const response = await testLogin({
      email: TestUser.email,
      password: TEST_USER.password + "a",
    });

    const errors = response.data.errors;

    expect(errors[0]).to.be.deep.equal({
      code: 401,
      message: "Wrong Email and/or Password",
    });
  });

  it("Should fail login because no email found", async () => {
    const response = await testLogin({
      email: TestUser.email + "a",
      password: TEST_USER.password,
    });

    const errors = response.data.errors;

    expect(errors[0]).to.be.deep.equal({
      code: 400,
      message: "Email not found",
    });
  });
});
