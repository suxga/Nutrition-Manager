import express, { Request, Response } from 'express'; // express の型を明示
import bodyParser from 'body-parser'; // body-parser
import cors from 'cors'; // cors
import db from '../database/knex'; // knex インポート

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 全食品データを取得
app.get('/api/foods', async (req: Request, res: Response) => {
  try {
    const foods = await db('foods').select('*');
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
});

// 新しい食品データを追加
app.post('/api/foods', async (req: Request, res: Response) => {
  const { name, calories, protein, carbs, fats } = req.body;
  try {
    await db('foods').insert({ name, calories, protein, carbs, fats });
    res.status(201).json({ message: 'Food added successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add food' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
