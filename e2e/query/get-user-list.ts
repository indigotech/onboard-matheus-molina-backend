import axios from "axios";

export async function testGetUserListQuery(
  token: string,
  options?: { limit?: number; page?: number }
) {
  const response = await axios.post(
    "http://localhost:4001/graphql",
    {
      operationName: null,
      variables: {
        data: {
          limit: options?.limit,
          page: options?.page,
        },
      },
      query: `query GetUserList($data: GetUserListInput) {
        getUserList(data: $data) {
          users {
            id
            email
            name
            birthDate
            addresses {
              cep
              state
              street
              neighborhood
              id
              complement
              city
            }
          }
          page
          hasNextPage
          hasPreviousPage
        }
      }
          `,
    },
    { headers: { Authorization: token } }
  );
  return response;
}
