import { expect } from "chai";
import { generateToken } from "../../src/cryptography/create-token";
import { AppDataSource } from "../../src/data-source";
import { User } from "../../src/entity/User";
import { testGetUserQuery } from "../query/get-user-test";
import { saveUserToDB } from "../save-user-to-db";

export const GetUserTest = function () {
  describe("CreateUser Mutation Scenario", async () => {
    let token: string;
    let TestUser: User;
    beforeEach(async () => {
      await AppDataSource.manager.clear(User);
      TestUser = await saveUserToDB();
      token = generateToken(TestUser, "secretKey", 1200);
    });

    it("Should get User by Id", async () => {
      const response = await testGetUserQuery(TestUser.id, token);

      expect(response.data.data.getUser).to.be.deep.equal({
        id: TestUser.id,
        name: TestUser.name,
        email: TestUser.email,
        birthDate: TestUser.birthDate,
      });
    });

    it("Should not get User by Id because no such Id exists", async () => {
      const response = await testGetUserQuery(0, token);

      expect(response.data.errors).to.deep.include({
        message: "No User with given Id",
        code: 400,
      });
    });

    it("Should not get User by Id because non uuthenticated", async () => {
      const response = await testGetUserQuery(TestUser.id, "token");
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
};
