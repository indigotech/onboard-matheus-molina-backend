import { expect } from "chai";
import * as dotenv from "dotenv";
import { before, describe, it } from "mocha";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import {
  CreateUserInput,
  createUserMutation,
} from "../src/mutation/create-user.use-case";
import { setup } from "../src/setup";

const TEST_VARIABLE: CreateUserInput = {
  name: "john-doe",
  email: "john-doe@email.com",
  password: "p4ssw0rd",
  birthDate: "00-00-0000",
};

describe("Test", async () => {
  before(async () => {
    dotenv.config({ path: __dirname + "/../test.env" });
    await setup();
    await AppDataSource.manager.clear(User);
  });

  it("Should Create User", async () => {
    const response = await createUserMutation(TEST_VARIABLE);
    expect({
      email: response.data.data.createUser.email,
      name: response.data.data.createUser.name,
      birthDate: response.data.data.createUser.birthDate,
    }).to.be.deep.equal({
      email: TEST_VARIABLE.email,
      name: TEST_VARIABLE.name,
      birthDate: TEST_VARIABLE.birthDate,
    });
    expect(response.data.data.createUser).to.have.all.keys(
      "id",
      "name",
      "email",
      "birthDate"
    );
  });
});
