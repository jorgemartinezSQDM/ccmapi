const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true, // This will help you. But you will see nwe error
        rejectUnauthorized: false, // This line will fix new error
      },
    },
  }
);

sequelize
  .authenticate()
  .then((connection) => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("DATABASE CONNECTION ERR => " + err);
  });

sequelize
  .sync({force: false})
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });
module.exports = sequelize;
