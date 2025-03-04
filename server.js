const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require('cors');
const app = express();
require("dotenv").config(); // 載入 .env 設定

// 解析 JSON 與 URL-encoded 資料
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 從 whitelist.json 載入允許的來源名單
const whitelist = require("./whitelist.json");

// const corsOptions = {
//     origin: function (origin, callback) {
//         // 如果沒有 origin（例如同源請求）則直接允許
//         if (!origin) return callback(null, true);
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
// };

// app.use(cors(corsOptions));

app.use(cors({
    origin: '*' // 或 '*' 允許所有來源
}));

// 新增根目錄 GET 路由
app.get("/", (req, res) => {
    res.send("hello world");
});

// 掛載 Waaship 路由
const waashipRouter = require("./routes/waaship");
app.use("/api/waaship", waashipRouter);

// 其他路由...

// 全域錯誤處理中介層
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "伺服器錯誤" });
});

const options = {
    key: fs.readFileSync("./ssl/myserver.key"), // 載入私鑰
    cert: fs.readFileSync("./ssl/buyeastern.xyz.crt"), // 載入網域憑證
    ca: fs.readFileSync("./ssl/GandiCert.pem"), // 載入中繼憑證
};

const port = process.env.MAP_PORT || 443;
https.createServer(options, app).listen(port, () => {
    console.log(`後端 HTTPS 伺服器運行在 ${port} 端口`);
});
