import axios from "axios";
import { CreateUserInput } from "../../src/mutation/create-user.use-case";

export async function testCreateUserMutation(
  input: CreateUserInput,
  token: string
) {
  const response = await axios.post(
    "http://localhost:4001/graphql",
    {
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
    },
    { headers: { Authorization: token } }
  );

  return response;
}
