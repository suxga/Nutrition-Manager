import React, { useEffect, useState } from 'react';
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

const FoodList: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/records', {
          withCredentials: true, // 認証情報を含める
        });
        console.log('Fetched records:', response.data);
        setFoods(response.data); // フードデータを状態に設定
      } catch (err) {
        console.error('Error fetching records:', err);
        setError('記録データの取得に失敗しました。');
      }
    };
  
    fetchRecords();
  }, []);  

  return (
    <div>
      <h1>食品データ一覧</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>食品名</th>
            <th>エネルギー (kcal)</th>
            <th>タンパク質 (g)</th>
            <th>脂質 (g)</th>
            <th>炭水化物 (g)</th>
            <th>食物繊維 (g)</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food.id}>
              <td>{food.name}</td>
              <td>{food.calories}</td>
              <td>{food.protein}</td>
              <td>{food.fats}</td>
              <td>{food.carbs}</td>
              <td>{food.dietaryfibers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodList;
