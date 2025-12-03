import sql from 'mssql/msnodesqlv8';

const server = process.env.DB_SERVER || 'DESKTOP-IEEADGP\\SQLEXPRESS';

export async function getMasterConnection(): Promise<sql.ConnectionPool> {
  const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=' + server + ';Database=kymos_master;Trusted_Connection=yes;';
  return await sql.connect({ connectionString });
}

export async function getCompanyConnection(dbName: string): Promise<sql.ConnectionPool> {
  const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=' + server + ';Database=' + dbName + ';Trusted_Connection=yes;';
  return await sql.connect({ connectionString });
}

export { sql };
