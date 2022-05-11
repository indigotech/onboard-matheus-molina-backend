import { expect } from "chai";
import * as dotenv from "dotenv";
import { before, describe, it } from "mocha";
import { verifyToken } from "../src/cryptography/verify-token";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import { CreateUserInput } from "../src/mutation/create-user.use-case";
import { setup } from "../src/setup";
import { testCreateUserMutation } from "./mutations/create-user-test";
import { testLogin } from "./mutations/login-test";
import { saveUserToDB, TEST_USER } from "./save-user-to-db";

const TEST_VARIABLE: CreateUserInput = {
  name: "john-doe",
  email: "john-doe@email.com",
  password: "passw0rd",
  birthDate: "00-00-0000",
};

describe("Test", async () => {
  let globalToken: string;
  before(async () => {
    dotenv.config({ path: __dirname + "/../test.env" });
    await setup();
    await AppDataSource.manager.clear(User);
    await saveUserToDB();
  });

  it("Should Login Succesfully", async () => {
    const response = await testLogin({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    const { token, user } = response.data.data.login;
    globalToken = token;

    expect(token).to.be.a("string");
    const decoded = verifyToken(token, "secretKey");
    expect({ id: decoded?.id, name: decoded?.name }).to.be.deep.equal({
      id: user.id,
      name: user.name,
    });
    expect(user).to.have.all.keys("id", "name", "email", "birthDate");
  });

  it("Should Create User", async () => {
    const response = await testCreateUserMutation(TEST_VARIABLE, globalToken);

    const { id, ...responseOtherFields } = response.data.data.createUser;
   

    const { password, ...inputOtherFields } = TEST_VARIABLE;
    const userCreated = await AppDataSource.manager.findOneBy(User, { id: id });

    expect(responseOtherFields).to.be.deep.equal(inputOtherFields);

    expect(id).to.be.a("number");

    expect(response.data.data.createUser).to.have.all.keys(
      "id",
      "name",
      "email",
      "birthDate"
    );
    expect(!!userCreated).to.be.true;
  });

  it("Should Login Successfully Given A Valid Input", async () => {
    const response = await testLogin({
      email: "john-doe@email.com",
      password: "passw0rd",
    });

    const { token, user } = response.data.data.login;

    expect(token).to.be.a("string");
    expect(user).to.have.all.keys("id", "name", "email", "birthDate");
  });
});
