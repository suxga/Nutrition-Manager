import React, { useState } from 'react';
import axios from 'axios';
import FoodList from './components/FoodList'; // FoodListコンポーネントをインポート

// Axiosの基本設定を変更
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = false;


// 食品データの型を定義
type Food = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

axios.defaults.withCredentials = false;

const App: React.FC = () => {
  const [newFood, setNewFood] = useState<Food>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const addFood = () => {
    axios
      .post('http://localhost:3000/api/foods', newFood)
      .then((response) => {
        console.log('Food added successfully:', response.data);
        setNewFood({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
      })
      .catch((error) => {
        console.error(
          'Error adding food:',
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <div>
      <h1>Nutrition Manager</h1>
      <FoodList /> {/* 食品データを表示するコンポーネント */}
      <h2>食品を追加</h2>
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
        onChange={(e) =>
          setNewFood({ ...newFood, calories: parseFloat(e.target.value) })
        }
      />
      <input
        type="number"
        placeholder="Protein"
        value={newFood.protein}
        onChange={(e) =>
          setNewFood({ ...newFood, protein: parseFloat(e.target.value) })
        }
      />
      <input
        type="number"
        placeholder="Carbs"
        value={newFood.carbs}
        onChange={(e) =>
          setNewFood({ ...newFood, carbs: parseFloat(e.target.value) })
        }
      />
      <input
        type="number"
        placeholder="Fats"
        value={newFood.fats}
        onChange={(e) =>
          setNewFood({ ...newFood, fats: parseFloat(e.target.value) })
        }
      />
      <button onClick={addFood}>Add Food</button>
    </div>
  );
};

export default App;
