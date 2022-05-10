import axios from "axios";

export async function testGetUserQuery(id: number, token: string) {
  const response = await axios.post(
    "http://localhost:4001/graphql",
    {
      operationName: null,
      variables: {
        data: {
          id: id,
        },
      },
      query: `query GetUser($data: GetUserInput!) {
            getUser(
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
