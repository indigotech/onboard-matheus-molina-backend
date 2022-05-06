import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export async function ConfigAppDataSource() {
  const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: parseInt(process.env.ENV_PORT!),
    username: "MaTMolina",
    password: "taqtilew415",
    database: process.env.ENV_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
  });
  await AppDataSource.initialize().catch((error) => console.log(error));
  return AppDataSource;
}
