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
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
  next();
    }
});


// CORS設定
app.use(cors({
  origin: '*', // 一時的に全てをパス
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], // 必要なヘッダーを許可
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 許可するHTTPメソッド
}));

app.options('*', cors()); // OPTIONSリクエストにCORS設定を適用
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080'); // フロントエンドのURL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 許可するHTTPメソッド
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 必要なヘッダーを明示
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 認証情報の送信を許可
  res.sendStatus(204); // No Contentで応答
});


app.use(express.json());


// 全食品データを取得
app.get('/api/foods', async (req, res) => {
  const { name } = req.query; // クエリパラメータから食品名を取得
  console.log('[DEBUG] GET /api/foods called');
  try {
    const foods = await db('foods')
      .where('name', name)
      .select('*');
    res.json(foods);
    console.log("foods",foods);
  } catch (error) {
    console.error('[ERROR] Fetching foods failed:', error);
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
});

// 全記録データを取得
app.get('/api/records', async (req, res) => {
  console.log('[DEBUG] Incoming GET /api/records request');
  try {
    const recordsQuery = db('records')
      .join('foods', 'records.food_id', '=', 'foods.id')
      .select('records.date', 'foods.name', 'foods.calories', 'foods.protein', 'foods.carbs', 'foods.fats');

    console.log('[DEBUG] SQL Query:', recordsQuery.toString()); // クエリを出力

    const records = await recordsQuery;
    console.log('[DEBUG] Retrieved records from DB:', records);

    res.json(records);
  } catch (error) {
    console.error('[ERROR] Fetching records failed:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// 新しい食品記録を保存
app.post('/api/records', async (req: Request, res: Response): Promise<void> => {
  console.log('[DEBUG] POST /api/records route reached');
  console.log('[DEBUG] Full request body:', req.body);
  console.log('[DEBUG] Headers:', req.headers);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  const { date, foodId } = req.body;
  console.log('[DEBUG] POST /api/records called with:', { date, foodId });

  if (!date || !foodId) {
    res.status(400).json({ error: 'Both date and foodId are required' });
    return;
  }

  try {
    await db('records').insert({ date, food_id: foodId });
    console.log('[DEBUG] New record added:', { date, foodId });
    res.status(201).json({ message: 'Record added successfully!' });
  } catch (error) {
    console.error('[ERROR] Adding record failed:', error);
    res.status(500).json({ error: 'Failed to add record' });
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

  app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error('[ERROR] Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
