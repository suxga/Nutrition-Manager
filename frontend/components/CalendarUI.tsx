import React, { useState, useEffect } from 'react';
import Calendar, {CalendarProps} from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

type CalendarValue = Date | [Date, Date] | null;

// 型定義
type Food = {
  name: string;
  calories: number;
};

type RecordForDate = {
  foods: Food[]; // `foods` プロパティを含む
};


type RecordsType = {
  [date: string]: Food[];
};

const CalendarUI: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [records, setRecords] = useState<RecordsType>({}); // 修正: 空のオブジェクトを初期値にする
  const [newFood, setNewFood] = useState<Food>({ name: '', calories: 0 });

  // 日付が変更されたときの処理
  const onDateChange: CalendarProps["onChange"] = (value, event) => {
    const selected = Array.isArray(value) ? value[0] : value;
    if (selected instanceof Date) {
      setSelectedDate(selected);
    }
  };
  

// データをバックエンドから取得
const fetchRecords = async () => {
  try {
    const response = await axios.get<RecordsType>('/api/records');
    setRecords(response.data);
  } catch (error) {
    console.error('Error fetching records:', error);
  }
};

useEffect(() => {
  fetchRecords();
}, [selectedDate]);  // **selectedDate を依存配列に追加**

// 記録ボタン押下時の処理
const handleRecordFood = async () => {
  const formattedDate = selectedDate.toISOString().split('T')[0];

  try {
    await axios.post('/api/records', {
      date: formattedDate,
      food: newFood,
    });

    setNewFood({ name: '', calories: 0 }); // 入力をリセット
    setRecords((prevRecords) => {
      const updatedFoods = [...(prevRecords[formattedDate] || []), newFood];
      return { ...prevRecords, [formattedDate]: updatedFoods };
    });

  } catch (error) {
    console.error('Error recording food:', error);
  }
};

    // カレンダーの日付に食品記録を表示する
    const tileContent = ({ date }: { date: Date}) => {
      console.log("tileContent called with date:", date); // 呼び出し確認用ログ
      if (!date) 
        // dateが無効な場合は null を返してエラー回避
      {console.error("tileContent received an invalid date:", date);  
      return null;}

      const formattedDate = date.toLocaleDateString("en-CA"); // "YYYY-MM-DD" フォーマット
      console.log("All records:", records);
      
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
      return <span>No Data</span>; // レコードがない場合の描画確認用
    };  

  // 選択した日付の記録を取得
  const recordsForSelectedDate = records[selectedDate.toISOString().split('T')[0]] || [];

  return (
    <div>
      <h1>食事記録カレンダー</h1>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        tileContent={tileContent} // 日付ごとの内容をカレンダーに表示
      />
      <h2>選択した日付: {selectedDate.toISOString().split('T')[0]}</h2>
      <h3>食事記録</h3>
      <ul>
  {recordsForSelectedDate.map((food, index) => (
    <li key={index}>
      {food.name}: {food.calories} kcal
    </li>
  ))}
</ul>

      <h3>食品を記録</h3>
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
        <button onClick={handleRecordFood}>記録</button>
      </div>
    </div>
  );
};

export default CalendarUI;