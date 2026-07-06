const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
// Railway က ပေးတဲ့ PORT ကို သုံးရပါမယ်
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Subdomain API is running on Railway!');
});

app.post('/create', async (req, res) => {
    const { subdomain, targetIp } = req.body;
    const ZONE_ID = process.env.ZONE_ID;
    const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

    try {
        const response = await axios.post(
            `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`,
            {
                type: 'A',
                name: subdomain,
                content: targetIp,
                ttl: 1,
                proxied: true
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json({ success: true, data: response.data.result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

