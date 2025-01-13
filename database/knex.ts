import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: 'C:\\Apache24\\htdocs\\basic\\Nutrition Manager\\nutrition.db',
  },
  useNullAsDefault: true,
});

export default db;

db.raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('[DEBUG] Database connection test passed');
  })
  .catch((err) => {
    console.error('[DEBUG] Database connection failed:', err);
  });

  db('records')
  .select('*')
  .then((rows) => {
    console.log('[DEBUG] Records Table:', rows);
  })
  .catch((err) => {
    console.error('[ERROR] Cannot access records table:', err);
  });

  db.raw('SELECT * FROM records')
  .then((rows) => {
    console.log('[DEBUG] Records Query Result:', rows);
  })
  .catch((err) => {
    console.error('[ERROR] Records Query Failed:', err);
  });
