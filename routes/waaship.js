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

// POST /api/waaship/:domain/callback
// 此端點用來接收 Waaship 回傳的 Callback 資料，並轉發到對應的網站
router.post("/:domain/callback", async (req, res) => {
    const domain = req.params.domain;
    console.log(`Callback received from domain: ${domain}`, req.body);

    // 根據傳入的 domain 組出目標 callback URL
    // 這裡假設每個網站都有一個固定的 callback endpoint，例如：https://<domain>/waaship-callback
    const targetUrl = `http://${domain}/waaship-callback`;

    try {
        const forwardResponse = await axios.post(targetUrl, req.body, {
            headers: { "Content-Type": "application/json" },
        });
        res.json({
            message: "Callback forwarded successfully",
            data: forwardResponse.data,
        });
    } catch (error) {
        console.error("Error forwarding callback:", error);
        res.status(500).json({
            error: "Error forwarding callback",
            details: error.message,
        });
    }
});

module.exports = router;
