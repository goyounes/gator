import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { readConfig } from "../../config";

const config = readConfig();
const conn = postgres(config.dbUrl); //db connection creation
export const db = drizzle(conn, { schema }); //setting up drizzle with the connection and the schema we create