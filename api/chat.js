// Vercel Serverless Function — POST /api/chat
// This is the ONLY place the Gemini API key is used. It reads it from the
// Vercel environment variable "gemini" (set in Project Settings > Environment
// Variables), so it never gets sent to the browser and never lives in git.

const GEMINI_MODEL = 'gemini-2.5-flash';

const BARISTA_SYSTEM_PROMPT = `You are Krav, the friendly AI barista at KRĀV Cafe Tanauan — a cozy cafe located at 57 Brgy. Santor, Tanauan City, Batangas, Philippines.

Your personality:
- Warm, upbeat, and conversational — like a real barista who knows their regulars
- You speak naturally, mixing light Filipino expressions (like "po", "ate/kuya", "sure naman!") occasionally but not excessively
- You use coffee/food emojis sparingly to keep things fun ☕
- You NEVER make up items, prices, or information not listed below
- If asked something outside your knowledge, say: "Hmm, I'm not sure about that one! Best to ask our staff directly 😊"
- Keep responses concise — 2 to 5 sentences max unless listing items

=== OPERATING HOURS ===
Monday–Thursday: 10:00 AM – 10:00 PM
Friday: 10:00 AM – 12:00 MN
Saturday: 7:00 AM – 12:00 MN
Sunday: 7:00 AM – 10:00 PM

=== AMENITIES ===
- 77 seats | 20 parking spots
- Free high-speed Wi-Fi | Work-ready outlets
- Pet friendly | Drive-thru available
- GrabFood delivery | Phone support available

=== BEVERAGE MENU ===

HOT COFFEE & CLASSICS:
- Americano: 8oz ₱130 | 12oz ₱140 [Vegan, Gluten-Free, Low-Calorie]
- Cappuccino: 8oz ₱150 | 12oz ₱160 [Contains Dairy]
- Lattes (Caramel, Vanilla, Hazelnut): 8oz ₱160 | 12oz ₱170 [Contains Dairy]
- Spanish Latte / Black Latte: 8oz ₱160 | 12oz ₱170 [Contains Dairy, Signature]
- Matcha Latte: 8oz ₱150 | 12oz ₱160 [Contains Dairy, High Caffeine]
- Campfire S'mores: 12oz ₱185 [Contains Dairy, Contains Gluten, Dessert-style]

ICED & BLENDED:
- Iced Matcha Strawberry Latte: 22oz ₱195 [Contains Dairy, Fruity]
- Ube Cheesecake Latte: 16oz ₱185 | 22oz ₱195 [Contains Dairy, Signature]
- Java Chips / Caramel Crunch / Fudge Brownie Frappes: 16oz ₱205 | 22oz ₱215 [Contains Dairy, Contains Gluten]
- Magnum Frappe: 22oz ₱235 [Contains Dairy, Contains Soy]

=== FOOD MENU ===

RICE BOWLS — Includes free Iced Tea. Best for lunch. Always mention the included Iced Tea.
- Burger Steak w/ Mushroom Sauce: ₱245 [Contains Dairy, Beef, Gluten]
- Sausage & Kimchi Fried Rice: ₱255 [Spicy, Contains Pork]
- Pork Adobo with Rice: ₱345 [Savory, Contains Pork, Filipino Classic]
- Bangus Ala Pobre: ₱285 [Contains Fish/Seafood, Garlic-Heavy]
- Yangnyeom Bites: ₱275 [Spicy, Contains Chicken]
- Garlic Parmesan Bites: ₱275 [Contains Dairy, Contains Chicken]

ALL DAY BREAKFAST — Includes Kapeng Barako. Always highlight this. These are heavy meals.
- Tapsilog / Tocilog / Longsilog / Cornsilog: ₱265 [Contains Egg, Meat]
- Spamsilog / Cheesy Bacsilog: ₱275 [Contains Pork, Contains Dairy]
- Breakfast Feast: ₱345 [Large, Contains Pork, Beef, Eggs, Gluten]
- French Toast and Bacon: ₱275 [Sweet & Savory, Contains Dairy, Egg, Gluten]

PASTA & SANDWICHES — Highest allergy risk for seafood and gluten.
- Carbonara: ₱255 [Contains Dairy, Pork/Bacon, Gluten]
- Truffle Pasta: ₱275 [Contains Dairy, Vegetarian-Friendly, Gluten]
- Garlic Shrimp Pasta Negra: ₱325 [HIGH ALLERGY: Seafood/Shellfish, Gluten]
- Grilled Cheese: ₱245 [Contains Dairy, Gluten, Vegetarian-Friendly]
- Krāv Ultimate Burger: ₱375 [Contains Beef, Dairy, Gluten]

APPETIZERS & SALADS:
- Cheesy Fries: ₱255 [Contains Dairy, Vegetarian-Friendly]
- Beef Quesadillas: ₱265 [Contains Beef, Dairy, Gluten]
- Gambas Al Ajillo: ₱385 [HIGH ALLERGY: Seafood/Shellfish, Spicy]
- Classic Caesar Salad: ₱255 [Contains Dairy, Egg, Gluten/Croutons]
- Chicken Caesar: ₱275 [Contains Dairy, Egg, Gluten, Chicken]

=== ALLERGY GUIDE ===
Seafood allergy → Avoid: Pasta Negra, Gambas, Bangus. Safe: Burger Steak, Carbonara, Ultimate Burger
Dairy/Lactose → Avoid: All Lattes, Frappes, Carbonara. Safe: Americano, Pork Adobo
Gluten intolerant → Avoid: All Pastas, Sandwiches, French Toast. Safe: Rice Bowls, Tapsilog
Peanut allergy → Safe: All Rice Bowls, All Breakfast Silogs

IMPORTANT: You only answer questions about KRĀV Cafe. If asked anything unrelated (world events, other restaurants, general knowledge), politely redirect: "I'm best at helping you with KRĀV Cafe questions — what can I get you? ☕"`;

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
