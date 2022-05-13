import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { CustomError } from "../errors/login-error-class";
import { checkToken } from "../utils/check-token";

export async function getUserList(
  token: string,
  options?: { page?: number; limit?: number }
) {
  await checkToken(token);
  let page: number;
  if (options?.page! <= 0) {
    throw new CustomError(400, "Index of page has to be greater than 0");
  } else {
    page = options?.page ?? 1;
  }
  let numberOfUsers = options?.limit ?? 10;
  const offset = (page - 1) * numberOfUsers;
  const DataSourceLength = await AppDataSource.manager.count(User);
  const hasPreviousPage = page !== 1;
  const hasNextPage = offset + numberOfUsers < DataSourceLength;
  const lastPage = Math.floor(DataSourceLength / numberOfUsers) + 1;

  if (numberOfUsers > DataSourceLength) {
    numberOfUsers = DataSourceLength;
  }

  if (page === lastPage) {
    numberOfUsers = DataSourceLength - offset;
  }

  if (page > lastPage) {
    return { users: [], page, hasNextPage: false };
  }

  const requestedUsers = await AppDataSource.manager.find(User, {
    order: {
      name: "ASC",
    },
    take: numberOfUsers,
    skip: offset,
    relations: {
      addresses: true,
    },
  });

  return { users: requestedUsers, page, hasNextPage, hasPreviousPage };
}
