const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// အရေးကြီး: .env ဖတ်မရရင် ဒီမှာ undefined လို့ ပြပါလိမ့်မယ်
console.log("Checking Zone ID:", process.env.ZONE_ID);

app.post('/create', async (req, res) => {
    const { subdomain, targetIp } = req.body;
    const ZONE_ID = process.env.ZONE_ID;
    const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

    if (!ZONE_ID || ZONE_ID === 'undefined') {
        return res.status(500).json({ error: "ZONE_ID မရှိပါ သို့မဟုတ် မမှန်ကန်ပါ" });
    }

    try {
        const response = await axios.post(
            `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`,
            { type: 'A', name: subdomain, content: targetIp, ttl: 1, proxied: true },
            { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' } }
        );
        res.json({ success: true, data: response.data.result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
