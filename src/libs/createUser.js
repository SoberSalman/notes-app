import User from "../models/User.js";

export async function createAdminUser() {
  try {
    const userFound = await User.findOne({ where: { email: "admin@localhost" } });
    
    if (userFound) return;

    const newUser = User.build({
      name: "Admin",
      email: "admin@localhost"
    });
    
    newUser.password = await newUser.encryptPassword("adminpassword");
    await newUser.save();
    
    console.log("Admin user created");
  } catch (error) {
    console.error(error);
  }
}
