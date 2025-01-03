import db from './knex';

async function testDB() {
  try {
    const foods = await db('foods').select('*');
    console.log('Foods:', foods);
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    process.exit();
  }
}

testDB();
