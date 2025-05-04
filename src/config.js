import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 4000;
export const NODE_ENV = process.env.NODE_ENV || "development";

// PostgreSQL configuration
export const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "notesapp",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  dialect: "postgres"
};
