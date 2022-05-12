import { verifyToken } from "../cryptography/verify-token";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { CustomError } from "../errors/login-error-class";
import { isAuthorized } from "../validators/authorization-validator";

export async function getUserList(
  token: string,
  options?: { page?: number; limit?: number }
) {
  let numberOfUsers: number = options?.limit ? options.limit : 10;
  const page: number = options?.page
    ? options.page <= 0
      ? 1
      : options.page
    : 1;
  const offset: number = (page - 1) * numberOfUsers;
  const DataSourceLength = await AppDataSource.manager.count(User);
  const hasPreviousPage: boolean = page != 1;
  const hasNextPage: boolean = offset + numberOfUsers < DataSourceLength;
  const lastPage: number = Math.floor(DataSourceLength / 10) + 1;

  if (numberOfUsers > DataSourceLength) {
    throw new CustomError(400, "Requisition over the limit");
  }

  if (page > lastPage) {
    throw new CustomError(
      400,
      "This Page is over the limit and does not exist"
    );
  }

  const decoded = await verifyToken(token, "secretKey");
  const authorized = await isAuthorized(decoded!.id);

  if (!authorized) {
    throw new CustomError(401, "User Unauthorized, please create User");
  }

  if (page === lastPage) {
    numberOfUsers = DataSourceLength - offset;
  }

  const requestedUsers = await AppDataSource.manager.find(User, {
    take: numberOfUsers,
    skip: offset,
  });
  requestedUsers.sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );

  return { users: requestedUsers, page, hasNextPage, hasPreviousPage };
}
