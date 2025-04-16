const express = require('express');
const bodyParser = require('body-parser');
const { parseData, generateMessage } = require('./functions'); // functions.js をインポート

const app = express();
const PORT = 3000;

// ミドルウェア
app.set('view engine', 'ejs'); // テンプレートエンジンにEJSを指定
app.set('views', __dirname + '/views'); // EJSファイルのディレクトリ

app.use(bodyParser.urlencoded({ extended: true })); // フォームデータを解析
app.use(express.static('public')); // 静的ファイル (style.css や HTML) を提供

// ルート (初期ページ表示)
app.get('/', (req, res) => {
    res.render('index', { title: 'インスタンス割ツール' });
});

// フォームの送信を処理する
app.post('/process', (req, res) => {
    const inputText = req.body.inputText; // フォームから送信されたデータ
    if (!inputText) {
        return res.send('<h1>エラー: 入力がありません。</h1>');
    }

    try {
        // テキストを解析し、メッセージを生成
        const parsedData = parseData(inputText);
        const instanceNames = Object.keys(parsedData);
        const messages = instanceNames.map(instanceName => {
            const performers = parsedData[instanceName]['パフォーマー'];
            const performerRoles = parsedData[instanceName]['ロール情報'];
            const waiters = parsedData[instanceName]['ウェイター'];
            const message = generateMessage(instanceName, performers, performerRoles, waiters);
            return{
                instanceName,
                message
            };
        });

        // EJSテンプレートにデータ、タイトルを渡して描画
        res.render('result', {
            title: '変換結果', 
            messages
        });

    } catch (error) {
        console.error('エラー:', error);
        res.status(500).send('<h1>エラーが発生しました。入力内容を確認してください。</h1>');
    }
});

// サーバーを起動
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
