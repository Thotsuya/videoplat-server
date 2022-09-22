import * as Sequelize from "sequelize";
import sequelize from "database";

export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Sequelize.Model<UserAttributes> {
  id?: number;
  email: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const User = sequelize.define<UserModel, UserAttributes>("User", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  role: {
    type: Sequelize.STRING,
  },
});
