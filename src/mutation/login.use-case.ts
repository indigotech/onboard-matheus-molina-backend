interface LoginInput {
  email: string;
  password: string;
}
export async function login(input: LoginInput) {
  return mock_logged_user;
}

export const mock_logged_user = {
  user: {
    id: 12,
    name: "User Name",
    email: "User e-mail",
    birthDate: "04-25-1990",
  },
  token: "the_token",
};
