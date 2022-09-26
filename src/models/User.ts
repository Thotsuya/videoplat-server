import * as Sequelize from "sequelize";
import sequelize from "../database";
import Video, { VideoAttributes, VideoModel } from "./Video";

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
  videos?: VideoAttributes[];
  likedVideos?: VideoAttributes[];
  followers?: UserAttributes[];
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
  followers?: UserAttributes[];
  videos?: VideoModel[];
  likedVideos?: VideoModel[];
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

export const LikedVideos = sequelize.define("LikedVideos", {
  user_id: {
    type: Sequelize.INTEGER,
  },
  video_id: {
    type: Sequelize.INTEGER,
  },
});

export const Followers = sequelize.define("Followers", {
  user_id: {
    type: Sequelize.INTEGER,
  },
  follower_id: {
    type: Sequelize.INTEGER,
  },
});

User.belongsToMany(Video, {
  through: LikedVideos,
  as: "likedVideos",
  foreignKey: "user_id",
  otherKey: "video_id",
});

Video.belongsToMany(User, {
  through: LikedVideos,
  as: "likedBy",
  foreignKey: "video_id",
  otherKey: "user_id",
});

// Follow Unfollow
User.belongsToMany(User, {
  through: Followers,
  as: "followers",
  foreignKey: "user_id",
  otherKey: "follower_id",
});

export default User;
