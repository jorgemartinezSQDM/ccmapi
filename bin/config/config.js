if (process.env.NODE_ENV !== "production") require("dotenv").config(); // allows to obtain the environment variable of .env

// ─── PORT ───────────────────────────────────────────────────────────────────────
process.env.PORT = process.env.PORT || 3000; //  In case you are local, the port will be 8080.
// ────────────────────────────────────────────────────────────────────────────────

// ─── ENVIRONMENT ────────────────────────────────────────────────────────────────
console.log("Environment: ", process.env.NODE_ENV); // Show which enviroment is in use.
console.log("Port: ", process.env.PORT); // Show which PORT is in use.
//console.log("Salesforce Url: ",process.env.INSTANCE_URL);
// ────────────────────────────────────────────────────────────────────────────────

// ─── DATABASE ───────────────────────────────────────────────────────────────────

const syncDatabase = process.env.SYNC_DATABASE;
/*console.log({
  DATABASE: {
    PG_USER: process.env.PG_USER,
    PG_HOST: process.env.PG_HOST,
    PG_DATABASE: process.env.PG_DATABASE,
    PG_PASSWORD: process.env.PG_PASSWORD,
    PG_PORT: process.env.PG_PORT,
  },
});*/
/*process.env.URLDB =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_DEV; //environment variable called from .env and used in server.js*/
// ────────────────────────────────────────────────────────────────────────────────

// ─── SEED ───────────────────────────────────────────────────────────────────────
process.env.SEED = process.env.AUT_SEED; // this is the authentication seed
// ────────────────────────────────────────────────────────────────────────────────

// ─── TOKE EXPIRATION ────────────────────────────────────────────────────────────
process.env.TOKEN_EXPIRATION = "8h";
// ────────────────────────────────────────────────────────────────────────────────

module.exports = {
  syncDatabase
}