import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: '../../nutrition.db',
  },
  useNullAsDefault: true,
});

export default db;
