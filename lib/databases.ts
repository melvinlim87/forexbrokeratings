import mysql from 'mysql2/promise';

const openRouterKey = "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";
const openAIAPIKey = "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"
export async function setupTables(config: {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}) {
  try {
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port
    });

    console.log('🔧 Creating `users` table if not exists...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('📥 Inserting sample data into `users`...');
    const sampleUsers = [
      ['Alice', 'alice@example.com'],
      ['Bob', 'bob@example.com'],
      ['Charlie', 'charlie@example.com']
    ];

    for (const [name, email] of sampleUsers) {
      try {
        await connection.execute(
          'INSERT INTO users (name, email) VALUES (?, ?)',
          [name, email]
        );
      } catch (err: any) {
        if (!err.message.includes('Duplicate entry')) {
          console.error(`⚠️ Failed to insert ${name}:`, err.message);
        }
      }
    }

    console.log('✅ Table creation and data insertion complete!');
    await connection.end();
  } catch (error) {
    console.error('❌ Failed to set up tables:', error);
  }
}
