import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Note = sequelize.define("Note", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Note;
