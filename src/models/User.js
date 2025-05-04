import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../database.js";

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

// Instance methods
User.prototype.encryptPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

User.prototype.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default User;
