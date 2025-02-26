// routes/waaship.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// 從環境變數讀取 access_token
const accessToken = process.env.WAASHIP_TOKEN;

// POST /api/waaship/select-store
// 此端點將前端的請求轉發到 Waaship 的 API
router.post("/select-store", async (req, res) => {
    try {
        const waashipResponse = await axios.post(
            "https://map.waaship.com/select-store",
            req.body, // 前端傳入的 body 參數
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                responseType: "text", // 回傳的是 HTML 內容
            }
        );
        // 將 Waaship API 回傳的 HTML 直接送回前端
        res.send(waashipResponse.data);
    } catch (error) {
        console.error("select-store proxy error:", error);
        res.status(500).json({ error: "select-store proxy error" });
    }
});

// POST /api/waaship/select-store-callback/:token
// 此端點用來接收 Waaship 回傳的 Callback 資料
router.post("/select-store-callback/:token", (req, res) => {
    const token = req.params.token;
    // 此處可以根據 token 驗證 Callback 的合法性
    console.log("Callback received, token:", token, "Data:", req.body);
    // 回傳 JSON 成功訊息
    res.json({ message: "Callback received", data: req.body });
});

module.exports = router;
