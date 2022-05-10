import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});

export async function ConfigAppDataSource() {
  try {
    await AppDataSource.setOptions({
      host: process.env.HOST,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: parseInt(process.env.DATABASE_PORT!),
    }).initialize();
  } catch (error) {
    console.log("Erro no DataBase:", error);
  }
}
