import faker from "@faker-js/faker";
import { expect } from "chai";
import * as dotenv from "dotenv";
import { before, describe } from "mocha";
import { generateToken } from "../src/cryptography/create-token";
import { hashPassword } from "../src/cryptography/password-encription";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import { CreateUserInput } from "../src/mutation/create-user.use-case";
import { populateDB } from "../src/seeder/seeder";
import { setup } from "../src/setup";
import { testGetUserListQuery } from "./query/get-user-list";
import { saveUserToDB } from "./save-user-to-db";
import { CreateUserTest } from "./scripts/create-user-script";
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
    await AppDataSource.manager.clear(User);
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
    beforeEach(async () => {
      await populateDB();
    });

    it("Should Get UserList Sorted First Page ", async () => {
      const response = await testGetUserListQuery(token);
      const sortedResponse = response.data.data.getUserList.users.sort(
        (a: User, b: User) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
      );
      expect(sortedResponse).to.be.deep.equal(
        response.data.data.getUserList.users
      );
      expect(response.data.data.getUserList.users.length).to.be.equal(10);
      expect(response.data.data.getUserList.page).to.be.eq(1);
      expect(response.data.data.getUserList.hasNextPage).to.be.true;
      expect(response.data.data.getUserList.hasPreviousPage).to.be.false;
    });

    it("Should Get UserList Second Page", async () => {
      const response = await testGetUserListQuery(token, { page: 2 });
      expect(response.data.data.getUserList.users.length).to.be.equal(10);
      expect(response.data.data.getUserList.page).to.be.eq(2);
      expect(response.data.data.getUserList.hasNextPage).to.be.true;
      // expect(response.data.data.getUserList.hasPreviousPage).to.be.true;
    });

    it("Should Get UserList All DataBase on First Page", async () => {
      const DataSourceLength = await AppDataSource.manager.count(User);
      const response = await testGetUserListQuery(token, {
        limit: DataSourceLength,
      });
      expect(response.data.data.getUserList.users.length).to.be.equal(
        DataSourceLength
      );
      expect(response.data.data.getUserList.page).to.be.eq(1);
      expect(response.data.data.getUserList.hasNextPage).to.be.false;
      expect(response.data.data.getUserList.hasPreviousPage).to.be.false;
    });

    it("Should Get UserList Last Page", async () => {
      const DataSourceLength = await AppDataSource.manager.count(User);
      const limit = 10;

      const page = Math.floor(DataSourceLength / limit) + 1;
      const response = await testGetUserListQuery(token, {
        page: page,
        limit: limit,
      });
      expect(response.data.data.getUserList.hasNextPage).to.be.false;
      expect(response.data.data.getUserList.users.length).to.be.equal(
        DataSourceLength - (page - 1) * limit
      );
      expect(response.data.data.getUserList.hasPreviousPage).to.be.true;
    });

    it("Should Fail To Get UserList Because Non Authenticated", async () => {
      const response = await testGetUserListQuery("token");

      expect({
        message: response.data.errors[0].message,
        code: response.data.errors[0].code,
      }).to.be.deep.equal({
        message: "Invalid Token",
        code: 401,
      });
    });

    it("Should Fail to get user list because page is equal to zero", async () => {
      const response = await testGetUserListQuery(token, { page: 0 });

      expect(response.data.errors[0]).to.be.deep.eq({
        code: 400,
        message: "Index of page has to be greater than 0",
      });
    });
  });
  describe("Get UserList Test", async () => {
    beforeEach(async () => {
      await populateDB();
    });

    it("Should Get UserList Sorted First Page ", async () => {
      const response = await testGetUserListQuery(token);
      const sortedResponse = response.data.data.getUserList.users.sort(
        (a: User, b: User) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
      );
      expect(sortedResponse).to.be.deep.equal(
        response.data.data.getUserList.users
      );
      expect(response.data.data.getUserList.users.length).to.be.equal(10);
      expect(response.data.data.getUserList.page).to.be.eq(1);
      expect(response.data.data.getUserList.hasNextPage).to.be.true;
      expect(response.data.data.getUserList.hasPreviousPage).to.be.false;
    });

    it("Should Get UserList Second Page", async () => {
      const response = await testGetUserListQuery(token, { page: 2 });
      expect(response.data.data.getUserList.users.length).to.be.equal(10);
      expect(response.data.data.getUserList.page).to.be.eq(2);
      expect(response.data.data.getUserList.hasNextPage).to.be.true;
      expect(response.data.data.getUserList.hasPreviousPage).to.be.true;
    });

    it("Should Get UserList All DataBase on First Page", async () => {
      const DataSourceLength = await AppDataSource.manager.count(User);
      const response = await testGetUserListQuery(token, {
        limit: DataSourceLength,
      });
      expect(response.data.data.getUserList.users.length).to.be.equal(
        DataSourceLength
      );
      expect(response.data.data.getUserList.page).to.be.eq(1);
      expect(response.data.data.getUserList.hasNextPage).to.be.false;
      expect(response.data.data.getUserList.hasPreviousPage).to.be.false;
    });

    it("Should Get UserList Last Page", async () => {
      const DataSourceLength = await AppDataSource.manager.count(User);
      const limit = 10;

      const page = Math.floor(DataSourceLength / limit) + 1;
      const response = await testGetUserListQuery(token, {
        page: page,
        limit: limit,
      });
      expect(response.data.data.getUserList.hasNextPage).to.be.false;
      expect(response.data.data.getUserList.users.length).to.be.equal(
        DataSourceLength - (page - 1) * limit
      );
    });

    it("Should Fail To Get UserList Because Non Authenticated", async () => {
      const response = await testGetUserListQuery("token");

      expect({
        message: response.data.errors[0].message,
        code: response.data.errors[0].code,
      }).to.be.deep.equal({
        message: "Invalid Token",
        code: 401,
      });
    });

    it("Should Fail To Get UserList Because Non Existing Page", async () => {
      const DataSourceLength = await AppDataSource.manager.count(User);
      const limit = 10;
      const lastPage = Math.floor(DataSourceLength / limit) + 1;
      const response = await testGetUserListQuery(token, {
        limit,
        page: lastPage + 2,
      });
      expect({
        message: response.data.errors[0].message,
        code: response.data.errors[0].code,
      }).to.be.deep.equal({
        message: "This Page is over the limit and does not exist",
        code: 400,
      });
    });

    it("Should Fail To Get UserList Because Request Bigger Than DataBase Length", async () => {
      const DataSourceLength = await AppDataSource.manager.count(User);
      const limit = DataSourceLength + 5;
      const response = await testGetUserListQuery(token, {
        limit,
      });
      expect({
        message: response.data.errors[0].message,
        code: response.data.errors[0].code,
      }).to.be.deep.equal({
        message: "Requisition over the limit",
        code: 400,
      });
    });
  });
});

async function populateDB() {
  let UserList: User[] = [];
  for (let i = 0; i < 50; i++) {
    const newUser = new User();
    newUser.name = faker.name.firstName();
    newUser.email = faker.internet.email(newUser.name);

    newUser.birthDate = faker.date
      .between("1950-01-01T00:00:00.000Z", "2010-01-01T00:00:00.000Z")
      .toJSON()
      .substring(0, 10);

    const { hashedPassword, salt } = hashPassword("p4ssw0rd");
    newUser.password = hashedPassword;
    newUser.salt = salt;

    UserList.push(newUser);
  }
  await Promise.all(UserList.map((user) => AppDataSource.manager.save(user)));
}
