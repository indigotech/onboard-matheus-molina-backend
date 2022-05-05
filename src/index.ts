import { setup } from "./setup";
import * as dotenv from "dotenv";

dotenv.config();
console.log("process.env", process.env.ENV_PORT, process.env.ENV_DATABASE);
setup();
