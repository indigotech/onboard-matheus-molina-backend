import axios from "axios";
import { CreateUserInput } from "../../src/mutation/create-user.use-case";


export async function testCreateUserMutation(input: CreateUserInput) {
  const response = await axios.post("http://localhost:4001/graphql", {
    operationName: null,
    variables: {
      data: {
        name: input.name,
        email: input.email,
        birthDate: input.birthDate,
        password: input.password,
      },
    },
    query: `mutation CreateUser($data: UserInput!) {
        createUser(
          data: $data
        ) {
          id
          email
          name
          birthDate
        }
      }
      `,
  });

  return response;
}
