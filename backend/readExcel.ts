import * as xlsx from 'xlsx';
import knex from 'knex'; // knexライブラリをインポート

// データベース接続設定
const db = knex({
  client: 'sqlite3', // SQLite3を指定
  connection: {
    filename: './nutrition.db', // SQLiteファイルのパス
  },
  useNullAsDefault: true, // SQLiteでNULLをデフォルト値として使用
});

// Excelデータ読み取り関数
const readExcelData = (filePath: string): Record<string, any>[] => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // 最初のシートを取得
    const sheet = workbook.Sheets[sheetName];

    // データ範囲を設定（3行目以降を使用）
    const range = xlsx.utils.decode_range(sheet['!ref'] || '');
    range.s.r = 2; // 0ベースで3行目=2
    sheet['!ref'] = xlsx.utils.encode_range(range);

    // JSON形式でデータを取得（ヘッダーなしで取得）
    const rawData: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // ヘッダーを手動で指定
    const headers = ['食品名', 'エネルギー', 'タンパク質', '脂質', '炭水化物', '食物繊維'];

    // ヘッダーと行データをマッピング
    const data = rawData.map((row) => {
      const mappedRow: Record<string, any> = {};
      headers.forEach((header, index) => {
        mappedRow[header] = row[index] || null; // データがない場合は null を設定
      });
      return mappedRow;
    });

    return data;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return [];
  }
};

// データベース保存関数
const saveToDatabase = async (data: Record<string, any>[]) => {
  try {
    for (const row of data) {
      if (!row['食品名']) {
        console.warn('食品名が空の行をスキップしました。');
        continue;
      }

      const dataToInsert = {
        name: row['食品名'],
        calories: parseFloat(row['エネルギー']) || 0,
        protein: parseFloat(row['タンパク質']) || 0,
        fats: parseFloat(row['脂質']) || 0,
        carbs: parseFloat(row['炭水化物']) || 0,
        dietaryfibers: parseFloat(row['食物繊維']) || 0,
      };

      console.log('Inserting data:', dataToInsert);

      await db('foods').insert(dataToInsert);
    }

    console.log('データの挿入が完了しました。');
  } catch (error) {
    console.error('Error saving data to database:', error);
  } finally {
    await db.destroy(); // 接続を閉じる
  }
};

// メイン処理
const filePath = 'C:\\Apache24\\htdocs\\basic\\Nutrition Manager\\data\\250103栄養素管理文科省データベース.xlsx';
const data = readExcelData(filePath);

if (data.length > 0) {
  console.log('Sample Columns:', Object.keys(data[0])); // 列名を確認
  saveToDatabase(data);
} else {
  console.error('No data found in the Excel file.');
}
