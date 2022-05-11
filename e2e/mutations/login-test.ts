import axios from "axios";
import { LoginInput } from "../../src/mutation/login.use-case";

export async function testLogin(input: LoginInput) {
  const response = await axios.post("http://localhost:4001/graphql", {
    operationName: null,
    variables: {
      data: {
        email: input.email,
        password: input.password,
      },
    },
    query: `mutation Login($data:LoginInput!) {
        login(
          data: $data
        ) {
          user {
            id
            email
            name
            birthDate
          }
          token
        }
      }`,
  });
  return response;
}
