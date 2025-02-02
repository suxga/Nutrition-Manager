import React, { useState } from 'react';
import axios from 'axios';

interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  dietaryfibers: number;
}

interface Totals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  dietaryfibers: number;
}

const NutritionTracker: React.FC = () => {
  const [foodName, setFoodName] = useState(''); // 入力された食品名
  const [records, setRecords] = useState<Food[]>([]); // 食事記録
  const [totals, setTotals] = useState<Totals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    dietaryfibers: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // 食品を追加する関数
  const addFood = async () => {
    try {
      const response = await axios.get<Food[]>(`http://127.0.0.1:3000/api/foods?name=${encodeURIComponent(foodName)}`);
      const food = response.data[0]; // 一致する食品データを取得
      if (!food) {
        setError('すまぬ、食品が見つからぬ');
        return;
      }
      if (food) {
        setRecords((prevRecords) => [...prevRecords, food]); // 型推論を明確にする
      }
            setTotals({
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        carbs: totals.carbs + food.carbs,
        fats: totals.fats + food.fats,
        dietaryfibers: totals.dietaryfibers + food.dietaryfibers,
      });
      setError(null);
      setFoodName(''); // 入力をクリア
    } catch (err) {
      setError('食品データの取得に失敗しました');
      console.error(err);
    }
  };

  const addRecord = async (foodId: number) => {
    console.log('Attempting POST request:', {
      url: 'http://localhost:3000/api/records',
      body: { date: new Date().toISOString().split('T')[0], foodId },
    });
    
    try {
      const today = new Date().toISOString().split('T')[0]; // 現在の日付 (YYYY-MM-DD 形式)
      console.log('Attempting to send POST request with:', { date: today, foodId });

      const response = await axios.post(
        'http://localhost:3000/api/records', // フルURLを指定
        { date: today, foodId: foodId },
        {
          headers: {
            'Content-Type': 'application/json',
          }} // Ensure this matches backend CORS settings
      );
  
      console.log('Response from backend:', response.data);
      alert('記録が追加されましたよ～');
    } catch (error: any) {
      if (error.response) {
        // サーバーからのレスポンスがある場合
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        // リクエストが送信されたが応答がない場合
        console.error('Error request:', error.request);
      } else {
        // その他のエラー
        console.error('Error message:', error.message);
      }
      alert('記録の追加に失敗しました');
    }
  };  
  
  return (
    <div>
      <h2>Nutrition Checker</h2>
      
      {/* 入力フォーム */}
      <div>
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="食品名を入力"
        />
        <button onClick={addFood}>追加</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 食事記録 */}
      <h2>食品の栄養素データ</h2>
      <table>
        <thead>
          <tr>
            <th>食品名</th>
            <th>エネルギー (kcal)</th>
            <th>タンパク質 (g)</th>
            <th>炭水化物 (g)</th>
            <th>脂質 (g)</th>
            <th>食物繊維 (g)</th>
          </tr>
        </thead>
        <tbody>
  {records.map((food) => (
    <tr key={food.id}>
      <td>{food.name}</td>
      <td>{food.calories}</td>
      <td>{food.protein}</td>
      <td>{food.carbs}</td>
      <td>{food.fats}</td>
      <td>{food.dietaryfibers}</td>
      <td>
      <button onClick={() => {
  console.log('Food ID being passed:', food.id);
  addRecord(food.id);
  console.log("「カレンダーに記録ボタン」がクリックされた");
}}>カレンダーに記録</button>

      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* 栄養素の合計
      <h2>合計栄養素</h2>
      <ul>
        <li>エネルギー: {totals.calories} kcal</li>
        <li>タンパク質: {totals.protein} g</li>
        <li>炭水化物: {totals.carbs} g</li>
        <li>脂質: {totals.fats} g</li>
        <li>食物繊維: {totals.dietaryfibers} g</li>
      </ul>　*/}
    </div>
  );
};

export default NutritionTracker;
