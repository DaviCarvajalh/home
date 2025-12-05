const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'P4ssw0rd00', // Cambia esto por tu password
  server: 'DESKTOP-IEEADGP\\SQLEXPRESS',
  database: 'kymos_master',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function testConnection() {
  try {
    console.log('Conectando a SQL Server...');
    const pool = await sql.connect(config);
    console.log('✓ Conexión exitosa!');
    
    // Probar consulta
    const result = await pool.request().query('SELECT * FROM empresas');
    console.log('✓ Empresas registradas:', result.recordset);
    
    await pool.close();
  } catch (err) {
    console.error('✗ Error de conexión:', err.message);
  }
}

testConnection();
