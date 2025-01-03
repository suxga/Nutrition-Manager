import axios from 'axios';
import * as cheerio from 'cheerio';


// 食品データの型を定義
type Food = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

const scrapeFoodData = async (): Promise<Food[]> => {
  try {
    const url = 'https://fooddb.mext.go.jp/whats.html';
    const response = await axios.get(url);
    console.log(response.data); // ここでHTMLデータを出力
    const $ = cheerio.load(response.data);

    const foodData: Food[] = [];
    $('table tr').each((index, element) => {
      const name = $(element).find('td').eq(0).text().trim();
      const calories = parseFloat($(element).find('td').eq(1).text().trim());
      const protein = parseFloat($(element).find('td').eq(2).text().trim());
      const carbs = parseFloat($(element).find('td').eq(3).text().trim());
      const fats = parseFloat($(element).find('td').eq(4).text().trim());

      if (name) {
        foodData.push({ name, calories, protein, carbs, fats });
      }
    });

    return foodData;
  } catch (error) {
    console.error('Error scraping food data:', error);
    return [];
  }
};

// 実行して結果を表示
scrapeFoodData().then((data) => console.log(data));
