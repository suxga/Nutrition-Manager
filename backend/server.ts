import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from '../database/knex';

const app = express();

// リクエストログを出力するミドルウェア
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming request: ${req.method} ${req.url}`);
  console.log(`[DEBUG] Headers:`, req.headers);
  console.log(`[DEBUG] Query Parameters:`, req.query);
  next();
});


// CORS設定
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));

app.use(bodyParser.json());

// 全食品データを取得
app.get('/api/foods', async (req, res) => {
  console.log('[DEBUG] GET /api/foods called');
  try {
    const foods = await db('foods').select('*');
    res.json(foods);
  } catch (error) {
    console.error('[ERROR] Fetching foods failed:', error);
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
});

// 全記録データを取得
app.get('/api/records', async (req, res) => {
  console.log('[DEBUG] Incoming GET /api/records request');
  console.log('[DEBUG] GET /api/records endpoint called');
  try {
    const records = await db('records')
      .join('foods', 'records.food_id', '=', 'foods.id')
      .select('records.date', 'foods.name', 'foods.calories', 'foods.protein', 'foods.carbs', 'foods.fats');
    console.log('[DEBUG] Retrieved records from DB:', records);
    res.json(records);
  } catch (error) {
    console.error('[ERROR] Fetching records failed:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// サーバー起動
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://localhost:3000');
});

// ルート一覧を出力
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log(`[DEBUG] Registered route: ${middleware.route.path}`);
    console.log(`[DEBUG] Methods: ${Object.keys(middleware.route.methods)}`);
  }
});

// データベース接続確認
db.raw('SELECT 1+1 AS result')
  .then(() => console.log('[DEBUG] Database connection test passed'))
  .catch((err) => console.error('[ERROR] Database connection test failed:', err));
