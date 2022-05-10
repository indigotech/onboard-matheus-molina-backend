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
    const { id, ...otherFields } = response.data.data.createUser;
    const { password, ...inputOtherFields } = TEST_VARIABLE;
    const userCreated = await AppDataSource.manager.findOneBy(User, { id: id });

    expect(otherFields).to.be.deep.equal(inputOtherFields);

    expect(id).to.be.a("number");

    expect(response.data.data.createUser).to.have.all.keys(
      "id",
      "name",
      "email",
      "birthDate"
    );
    expect(!!userCreated).to.be.true;
  });
});
