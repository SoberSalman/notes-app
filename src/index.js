import app from "./app.js";
import sequelize from "./database.js";
import { createAdminUser } from "./libs/createUser.js";

async function main() {
  try {
    // Sync database models with retry logic
    let retries = 5;
    while (retries) {
      try {
        await sequelize.sync({ alter: true });
        console.log("Database synchronized");
        break;
      } catch (error) {
        retries -= 1;
        console.log(`Failed to sync database. ${retries} retries left.`);
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    // Create admin user
    await createAdminUser();
    
    // Start server
    app.listen(app.get("port"));
    console.log("Server on port", app.get("port"));
    console.log("Environment:", process.env.NODE_ENV);
  } catch (error) {
    console.error("Failed to start application:", error);
  }
}

main();
