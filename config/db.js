

import { Sequelize } from "sequelize";

const sequelize = new Sequelize("chatapp_db", "root", "Sachin0211", {
  host: "localhost",
  dialect: "mysql",
  // logging: false, // Disable logging in production
  logging: console.log,
});

export default sequelize