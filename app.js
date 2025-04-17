const express = require('express');
const session = require("express-session");
const bcrypt = require("bcrypt");
const fs = require('fs');
const bodyParser = require('body-parser');
const { parseData, generateMessage } = require('./functions'); // functions.js をインポート

const app = express();
const PORT = 3000;

// ミドルウェア
app.set('view engine', 'ejs'); // テンプレートエンジンにEJSを指定
app.set('views', __dirname + '/views'); // EJSファイルのディレクトリ

app.use(express.urlencoded({ extended: true })); //フォームデータ解析
app.use(express.static('public')); // 静的ファイル (style.css や HTML) を提供

app.use(session({
    secret: "your-secret-key", // 環境変数で管理推奨
    resave: false,
    saveUninitialized: true
}));

// アクセス制限
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

// ユーザー情報を読み込み
const users = JSON.parse(fs.readFileSync("users.json"));

// ログインページ(初期ページ)
app.get('/login', (req, res) => {
    res.render('login', {title: "ログイン", pageId: "login", error: null });
});
// ルートアクセス時はリダイレクト
app.get("/", (req, res) => {
    res.redirect("/login");
});
// ログイン済みならリダイレクト
app.get("/login", (req, res) => {
    res.redirect("/home");
});
// ログイン処理
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      req.session.user = username;
      return res.redirect("/home");
    }

    res.render("login", { title: "ログイン", pageId: "login", error: "ユーザー名またはパスワードが間違っています。" });
});

// ログアウト
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
});
// ページ表示
app.get("/home", requireLogin, (req, res) => {
    res.render("home", { title: "ホーム", username: req.session.user });
});
app.get("/converter", requireLogin, (req, res) =>{
    res.render("converter", { title: "インスタンス割テキスト変換ツール", username: req.session.user });
});

// フォームの送信を処理する
app.post('/process', requireLogin, (req, res) => {
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
                message,
                performerRoles
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
    // (async () => {
    //     const hashed = await bcrypt.hash('password', 10);
    //     console.log("ハッシュされたパスワード:", hashed);
    // })();
});
