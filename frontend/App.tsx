import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 食品データの型を定義
type Food = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

const App = () => {
  // 型を指定して状態を管理
  const [foods, setFoods] = useState<Food[]>([]); // Food型の配列
  const [newFood, setNewFood] = useState<Food>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  useEffect(() => {
    axios.get('http://localhost:3000/api/foods')
      .then((response) => {
        console.log('Fetched foods:', response.data);
        setFoods(response.data);
      })
      .catch((error) => {
        console.error('Error fetching foods:', error.response ? error.response.data : error.message);
      });
  }, []);  

  const addFood = () => {
    axios.post('http://localhost:3000/api/foods', newFood)
      .then((response) => {
        console.log('Food added successfully:', response.data);
        setFoods([...foods, newFood]);
        setNewFood({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
      })
      .catch((error) => {
        console.error('Error adding food:', error.response ? error.response.data : error.message);
      });
  };
  

  return (
    <div>
      <h1>Nutrition Manager</h1>
      <ul>
        {foods.map((food, index) => (
          <li key={index}>
            {food.name} - {food.calories} kcal
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Name"
        value={newFood.name}
        onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Calories"
        value={newFood.calories}
        onChange={(e) => setNewFood({ ...newFood, calories: +e.target.value })}
      />
      <button onClick={addFood}>Add Food</button>
    </div>
  );
};

export default App;
