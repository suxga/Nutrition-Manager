import React, { useState } from 'react';
import axios from 'axios';
import NutritionTracker from './components/NutritionTracker';
import CalendarUI from './components/CalendarUI';

// Axiosの基本設定を変更
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json';


// 食品データの型を定義
type Food = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  dietaryfibers: number;
};

const App: React.FC = () => {
  const [newFood, setNewFood] = useState<Food>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    dietaryfibers: 0,
  });

  const handleFoodAddition = () => {
    console.log('Added food:', newFood);
  };
  

  const addFood = () => {
    axios
      .post('/api/foods', newFood)
      .then((response) => {
        console.log('Food added successfully:', response.data);
        setNewFood({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0, dietaryfibers: 0 });
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
       {/* 今日の食事記録と合計栄養素 */}
      <NutritionTracker />
       {/* カレンダーUI */}
       <div style={{ marginTop: '40px' }}>
        <CalendarUI />
      </div> 
       {/* 食品を追加 */}
       <h2 style={{ marginTop: '40px' }}>食品を追加</h2>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Name"
          value={newFood.name}
          onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Calories"
          value={newFood.calories}
          onChange={(e) =>
            setNewFood({ ...newFood, calories: parseFloat(e.target.value) })
          }
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Protein"
          value={newFood.protein}
          onChange={(e) =>
            setNewFood({ ...newFood, protein: parseFloat(e.target.value) })
          }
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Carbs"
          value={newFood.carbs}
          onChange={(e) =>
            setNewFood({ ...newFood, carbs: parseFloat(e.target.value) })
          }
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Fats"
          value={newFood.fats}
          onChange={(e) =>
            setNewFood({ ...newFood, fats: parseFloat(e.target.value) })
          }
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="dietaryfibers"
          value={newFood.dietaryfibers}
          onChange={(e) =>
            setNewFood({ ...newFood, dietaryfibers: parseFloat(e.target.value) })
          }
          style={{ marginRight: '10px' }}
        />
        <button onClick={addFood}>Add Food</button>
      </div>
    </div>
  );
};

export default App;
