import axios from "axios";
import * as dotenv from "dotenv";
import { before, describe, it } from "mocha";
import { setup } from "../src/setup";

describe("Test", () => {
  before(async () => {
    console.log("entering before");
    dotenv.config({ path: __dirname + "/../test.env" });
    await setup();
  });

  it("Should create User", async () => {
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
    console.log(response.data);
  });
});
