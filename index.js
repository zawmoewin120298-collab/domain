const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/create', async (req, res) => {
    const { subdomain, targetIp } = req.body;
    const ZONE_ID = process.env.ZONE_ID;
    const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

    // Validation လုပ်ပါ
    if (!subdomain || !targetIp) {
        return res.status(400).json({ success: false, message: "subdomain နှင့် targetIp လိုအပ်သည်" });
    }

    try {
        const response = await axios.post(
            `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`,
            { type: 'A', name: subdomain, content: targetIp, ttl: 1, proxied: true },
            { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' } }
        );
        res.json({ success: true, data: response.data.result });
    } catch (error) {
        // Error ဖြစ်ရင် log ထုတ်ပေးပါ
        console.error("Cloudflare API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: "Cloudflare ချိတ်ဆက်မှု မအောင်မြင်ပါ" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
