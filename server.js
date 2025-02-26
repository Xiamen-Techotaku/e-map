// server.js
const express = require("express");
const app = express();
require("dotenv").config(); // 載入 .env 設定

// 解析 JSON 與 URL-encoded 資料
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 掛載 Waaship 路由
const waashipRouter = require("./routes/waaship");
app.use("/api/waaship", waashipRouter);

// 其他路由...

// 全域錯誤處理中介層
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "伺服器錯誤"});
});

const port = process.env.MAP_PORT || 443;
app.listen(port, () => {
    console.log(`後端伺服器運行在 ${port} 端口`);
});
