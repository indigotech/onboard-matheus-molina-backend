import axios from "axios";
import { expect } from "chai";
import * as dotenv from "dotenv";
import { before, describe, it } from "mocha";
import { books } from "../src/database";
import { setup } from "../src/setup";

describe("Test", () => {
  before(async () => {
    dotenv.config({ path: __dirname + "/../test.env" });
    await setup();
  });

  it("Should get books", async () => {
    const response = await axios.post("http://localhost:4001/graphql", {
      operationName: null,
      variables: {},
      query: `
          query {
            books {
              title
              author
            }
          }
        `,
    });
    expect(response.data.data.books).to.be.deep.eq(books);
  });
});
