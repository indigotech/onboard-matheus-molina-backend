import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "MaTMolina",
  password: "taqtilew415",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});

export async function ConfigAppDataSource() {
  await AppDataSource.setOptions({
    database: process.env.DATABASE,
    port: parseInt(process.env.DATABASE_PORT!),
  })
    .initialize()
    .catch((error) => console.log(error));
}
