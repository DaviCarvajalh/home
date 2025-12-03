const sql = require("mssql/msnodesqlv8");

const server = process.env.DB_SERVER || "DESKTOP-IEEADGP\\SQLEXPRESS";

async function getMasterConnection() {
  const connectionString = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=kymos_master;Trusted_Connection=yes;";
  return await sql.connect({ connectionString });
}

async function getCompanyConnection(dbName) {
  const connectionString = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=" + dbName + ";Trusted_Connection=yes;";
  return await sql.connect({ connectionString });
}

module.exports = { getMasterConnection, getCompanyConnection, sql };
