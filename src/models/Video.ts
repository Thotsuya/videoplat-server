import * as Sequelize from "sequelize";
import sequelize from "../database";
import User from "./User";

export interface VideoAttributes {
  id?: number;
  title: string;
  description: string;
  url: string;
  published: boolean;
  user_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VideoModel extends Sequelize.Model<VideoAttributes> {
  id?: number;
  title: string;
  description: string;
  url: string;
  published: boolean;
  user_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const Video = sequelize.define<VideoModel, VideoAttributes>(
  "Video",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
    published: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);
export default Video;
