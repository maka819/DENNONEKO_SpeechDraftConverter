const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// Expressアプリケーションを作成
const app = express();
const port = 3000;

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, "public")));

// ボディパーサの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ルート: 入力フォームを表示
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POSTリクエストを受け取る
app.post("/process", (req, res) => {
    const inputData = req.body.inputText; // フォームからの入力データを取得

    // functions.js の関数を利用
    const { parseData, generateMessage } = require("./public/js/functions.js");

    try {
        // 入力データを解析
        const parsedData = parseData(inputData);

        // 各インスタンスごとにメッセージを生成
        const messages = Object.keys(parsedData).map((instanceName) => {
            const performers = parsedData[instanceName]["パフォーマー"];
            return generateMessage(instanceName, performers);
        });

        // 結果をレスポンスとして返す
        res.json({ messages });
    } catch (error) {
        console.error("エラーが発生しました:", error);
        res.status(500).send("データの処理中にエラーが発生しました");
    }
});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
