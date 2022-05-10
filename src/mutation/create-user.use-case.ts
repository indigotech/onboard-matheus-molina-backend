import axios from "axios";

export interface CreateUserInput {
  name: string;
  email: string;
  birthDate: string;
  password: string;
}

export async function createUserMutation(input: CreateUserInput) {
  const response = await axios.post("http://localhost:4001/graphql", {
    operationName: null,
    variables: {
      data: input,
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
