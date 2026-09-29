// Vercel Serverless Function — POST /api/chat
// This is the ONLY place the Gemini API key is used. It reads it from the
// Vercel environment variable "gemini" (set in Project Settings > Environment
// Variables), so it never gets sent to the browser and never lives in git.

const GEMINI_MODEL = 'gemini-3.1-flash-lite';

const BARISTA_SYSTEM_PROMPT = `You are the friendly assistant for Lihim Café, a quiet garden café inside Gunita Villas and Pavilion on Santo Tomas-Lipa Road, Santo Tomas, Batangas, Philippines. It is about a 10-minute drive from Padre Pio National Shrine. "Lihim" means "secret".

Tone: warm, calm and concise (2 to 5 sentences unless listing). Plain English with an occasional light Filipino word such as "po". No made-up facts.

HOURS: Monday to Friday 11:00 AM - 9:00 PM. Saturday and Sunday 7:00 AM - 9:00 PM. Weekend breakfast is served Saturday and Sunday 7:00 - 11:00 AM.

THE PLACE: air-conditioned indoor dining with glass panels, al fresco garden seating, on-site parking, pet menu for dogs, food trays for parties, group sets (Everyday Spread PHP 2,000 and Celebration Spread PHP 3,380, each for 4 people). Payment by QR, card or cash. A 10% service charge applies to food and drinks.

MENU CATEGORIES: coffee, non-coffee and frappe; cakes, pastries, tea, juice and shakes; Filipino breakfast, waffles and pancakes; starters, salads, pizza and soup; Filipino classics and mains; rice meals and pasta; steaks, roasts and sides; food trays; soda, beer, wine and spirits; pet menu.
KNOWN HIGHLIGHTS: 8-hour slow-cooked Angus beef, oven-baked BBQ baby back ribs, belly kare-kare, crispy liempo adobo rice, salmon dishes, salted egg scampi carbonara, Ube Champorado (weekend mornings), Spanish latte, bibingka cake, and the 400g USDA Prime Delmonico steak (PHP 1,495 promo).

RULES: Prices change, so for any price other than those above, say the menu pages on the site show current prices and staff can confirm. Do not guess allergens or ingredients; tell guests to ask staff. Do not give a phone number; suggest messaging the Lihim Café Facebook page for reservations and inquiries. If asked about anything unrelated to Lihim Café, politely steer back to the café.`;

// Very small in-memory rate limiter per serverless instance. Not perfect
// (each cold start resets it, and Vercel may run multiple instances), but it
// blunts the most obvious abuse/spam without needing a database.
const hits = new Map();
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 60 * 1000; // per 1 minute per IP

function isRateLimited(ip) {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now - entry.start > RATE_WINDOW_MS) {
        hits.set(ip, { start: now, count: 1 });
        return false;
    }
    entry.count += 1;
    return entry.count > RATE_LIMIT;
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
        res.status(429).json({ error: 'Too many requests — please slow down.' });
        return;
    }

    const apiKey = process.env.gemini;
    if (!apiKey) {
        console.error('Missing "gemini" environment variable in Vercel project settings.');
        res.status(500).json({ error: 'Server is not configured with an AI key yet.' });
        return;
    }

    const { contents } = req.body || {};
    if (!Array.isArray(contents) || contents.length === 0) {
        res.status(400).json({ error: 'Missing "contents" in request body.' });
        return;
    }
    if (contents.length > 20) {
        res.status(400).json({ error: 'Conversation too long.' });
        return;
    }

    try {
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: BARISTA_SYSTEM_PROMPT }] },
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300
                    },
                    safetySettings: [
                        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
                        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
                        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
                        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
                    ]
                })
            }
        );

        const data = await geminiRes.json();

        if (!geminiRes.ok) {
            console.error('Gemini API error:', JSON.stringify(data));
            res.status(502).json({ error: 'AI service error.' });
            return;
        }

        const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim();

        if (!reply) {
            console.error('Gemini returned no usable reply:', JSON.stringify(data));
            res.status(200).json({ reply: null });
            return;
        }

        res.status(200).json({ reply });
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
