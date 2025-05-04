import { Sequelize } from "sequelize";
import { DB_CONFIG } from "./config.js";

const sequelize = new Sequelize(
  DB_CONFIG.database,
  DB_CONFIG.username,
  DB_CONFIG.password,
  {
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    dialect: DB_CONFIG.dialect,
    logging: false,
    retry: {
      max: 5,
      timeout: 30000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Function to connect with retries
const connectWithRetry = async (retries = 5, delay = 5000) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("Connected to PostgreSQL database");
      return;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error.message);
      lastError = error;
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  console.error("Max retries reached. Unable to connect to the database:", lastError);
  throw lastError;
};

try {
  await connectWithRetry();
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default sequelize;

