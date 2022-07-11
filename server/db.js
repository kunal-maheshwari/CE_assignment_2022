const Pool = require("pg").Pool;

module.exports = new Pool({
  user: "postgres",
  password: "pkun@088",
  host: "localhost",
  port: 5432,
  database: "CEAssignment2022",
});
