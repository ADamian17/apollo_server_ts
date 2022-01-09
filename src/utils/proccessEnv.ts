import * as dotenv from "dotenv"
dotenv.config();

export default {
  APP_SECRET: process.env.APP_SECRET ?? ""
};
