import * as Sequelize from "sequelize";
import sequelize from "../database";
import Video from "./Video";

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Sequelize.Model<UserAttributes> {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const User = sequelize.define<UserModel, UserAttributes>("User", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
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
  profileImage: {
    type: Sequelize.STRING,
  },
});

User.hasMany(Video, { foreignKey: "user_id", sourceKey: "id" });
Video.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

User.belongsToMany(Video, {
  through: "User_Likes",
  foreignKey: "user_id",
  otherKey: "video_id",
});

Video.belongsToMany(User, {
  through: "User_Likes",
  foreignKey: "video_id",
  otherKey: "user_id",
});

export default User;
