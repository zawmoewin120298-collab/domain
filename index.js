app.post('/create', async (req, res) => {
    // Data ရောက်မလာရင် ဘာဖြစ်မလဲ စစ်ဆေးခြင်း
    if (!req.body || !req.body.subdomain || !req.body.targetIp) {
        return res.status(400).json({ success: false, message: "subdomain နှင့် targetIp လိုအပ်ပါသည်" });
    }

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
        // Error အသေးစိတ်သိရအောင် response.data ကိုပါ ပြပေးပါ
        res.status(500).json({ success: false, error: error.response ? error.response.data : error.message });
    }
});
