const sql = require('mssql/msnodesqlv8');

const config = {
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-IEEADGP\\SQLEXPRESS;Database=kymos_master;Trusted_Connection=yes;'
};

async function testConnection() {
  try {
    console.log('Conectando con Windows Authentication...');
    const pool = await sql.connect(config);
    console.log('✓ Conexión exitosa!');
    
    const result = await pool.request().query('SELECT * FROM empresas');
    console.log('✓ Empresas registradas:', result.recordset);
    
    await pool.close();
  } catch (err) {
    console.error('✗ Error:', err.message);
  }
}

testConnection();
