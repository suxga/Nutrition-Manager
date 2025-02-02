import React, { useState, useEffect } from 'react';
import Calendar, {CalendarProps} from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useMemo } from 'react';

type CalendarValue = Date | [Date, Date] | null;

// 型定義
type Food = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  dietaryfibers: number;
};

type RecordForDate = {
  foods: Food[]; // `foods` プロパティを含む
};

type RecordsType = {
  [date: string]: Food[];
};

interface Totals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  dietaryfibers: number;
}

const CalendarUI: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [records, setRecords] = useState<RecordsType>({}); // 修正: 空のオブジェクトを初期値にする
  const [newFood, setNewFood] = useState<Food>({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0, dietaryfibers: 0 });

  // 日付が変更されたときの処理
  const onDateChange: CalendarProps["onChange"] = (value, event) => {
    const selected = Array.isArray(value) ? value[0] : value;
    if (selected instanceof Date) {
      setSelectedDate(selected);
    }
  };
  
useEffect(() => {
  if (!selectedDate) return;
  
  // YYYY-MM-DD 形式のUTC日付文字列を作成
  const formattedDate = selectedDate.toISOString().split("T")[0];

  fetchRecords(formattedDate);
}, [selectedDate]);

// データをバックエンドから取得
const fetchRecords = async (date: string) => {
   try {
    const response = await axios.get<RecordsType>(`/api/records-by-date?date=${date}`);
    console.log("取得したデータ:", response.data);
    setRecords(response.data);
  } catch (error) {
    console.error('Error fetching records:', error);
  }
};

/* // 記録ボタン押下時の処理
const handleRecordFood = async () => {
  console.log("handleRecordFood が呼ばれた"); 
  const formattedDate = selectedDate.toISOString().split('T')[0];
  console.log("送信するデータ:", {
    date: formattedDate,
    food: newFood,
  });

  try {
    await axios.post('/api/records', {
      date: formattedDate,
      food: newFood,
    });
    console.log("データ送信成功");
    setNewFood({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0, dietaryfibers: 0}); // 入力をリセット
    setRecords((prevRecords) => {
      const updatedFoods = [...(prevRecords[formattedDate] || []), newFood];
      return { ...prevRecords, [formattedDate]: updatedFoods };
    });

  } catch (error) {
    console.error('Error recording food:', error);
  }
}; */


    // カレンダーの日付に食品記録を表示する
    const tileContent = ({ date }: { date: Date}) => {
      console.log("tileContent called with date:", date); // 呼び出し確認用ログ
      if (!date) 
        // dateが無効な場合は null を返してエラー回避
      {console.error("tileContent received an invalid date:", date);  
      return null;}

      const formattedDate = date.toLocaleDateString("en-CA"); // "YYYY-MM-DD" フォーマット
      //console.log("All records:", records);
      
      // `records` は配列ではなくオブジェクトのため、`.find()` の代わりにキーを直接参照
      const recordFoods = records[formattedDate] || []; // 該当するデータがない場合は空配列を代入
      
      console.log("Looking for record with date:", formattedDate);
      console.log("Record foods for date:", recordFoods, "(type:", typeof recordFoods, ")");
      
      // `recordFoods` が配列であることを確認してから描画処理
      if (Array.isArray(recordFoods) && recordFoods.length > 0) {
        console.log("in if(Array.isArray(recordFoods) && recordFoods.length > 0)");
        return (
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '10px' }}>
            {recordFoods.slice(0, 2).map((food, index) => (
              <li key={index}>{food.name}</li>
            ))}
            {recordFoods.length > 2 && <li>他...</li>}
          </ul>
        );
      }
      
      console.log("record exists but foods is not an array or empty");
      return <span> </span>; // レコードがない場合の描画確認用
    };  

  // 選択した日付の記録を取得
  const recordsForSelectedDate = records[selectedDate.toISOString().split('T')[0]] || [];

  const totals = useMemo(() => {
    return recordsForSelectedDate.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fats: acc.fats + food.fats,
        dietaryfibers: acc.dietaryfibers + food.dietaryfibers,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, dietaryfibers: 0 }
    );
  }, [recordsForSelectedDate]);

  return (
    <div>
      <h1>食事記録カレンダー</h1>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        tileContent={tileContent} // 日付ごとの内容をカレンダーに表示
      />
      <h2>選択した日付: {selectedDate.toISOString().split('T')[0]}</h2>
      <h3> {selectedDate.toISOString().split('T')[0]}の食事記録</h3>
      <ul>
  {recordsForSelectedDate.map((food, index) => (
    <li key={index}>
    {food.name}: {food.calories} kcal, 
    タンパク質: {food.protein} g, 
    炭水化物: {food.carbs} g, 
    脂質: {food.fats} g, 
    食物繊維: {food.dietaryfibers} g
  </li>
  ))}
</ul>

 {/* 栄養素の合計 */}
 <h2> {selectedDate.toISOString().split('T')[0]}の合計栄養素</h2>
      <ul>
        <li>エネルギー: {totals.calories} kcal</li>
        <li>タンパク質: {totals.protein} g</li>
        <li>炭水化物: {totals.carbs} g</li>
        <li>脂質: {totals.fats} g</li>
        <li>食物繊維: {totals.dietaryfibers} g</li>
      </ul>

      {/* <h3>食品を記録</h3>
      <div>
        <input
          type="text"
          placeholder="食品名"
          value={newFood.name}
          onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="カロリー"
          value={newFood.calories}
          onChange={(e) =>
            setNewFood({ ...newFood, calories: parseInt(e.target.value) || 0 })
          }
        />
        <button onClick={() => {
          console.log("記録ボタンがクリックされた");
          handleRecordFood();
        }}>記録</button>
      </div> */}
    </div>
  );
};

export default CalendarUI;
