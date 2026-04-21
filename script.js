// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ==================== NAVBAR SCROLL ====================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
});

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('hamburger-btn');
    const icon = document.getElementById('hamburger-icon');

    if (!menu || !btn || !icon) return;

    const isOpen = !menu.classList.contains('hidden');

    if (!isOpen) {
        menu.classList.remove('hidden');
        btn.classList.add('active');
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6h12v12"/>`;
        document.body.style.overflow = 'hidden';
    } else {
        menu.classList.add('hidden');
        btn.classList.remove('active');
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
        document.body.style.overflow = 'visible';
    }
}

// ==================== MENU SCROLL ====================
function scrollMenuLeft() {
    document.getElementById('menu-scroll')?.scrollBy({ left: -400, behavior: 'smooth' });
}
function scrollMenuRight() {
    document.getElementById('menu-scroll')?.scrollBy({ left: 400, behavior: 'smooth' });
}

// ==================== CHAT STATE ====================
let isFirstOpen = true;

let chatMemory = {
    lastCategory: null,
    lastItem: null,
    conversationCount: 0,
    userPreferences: [],
    suggestedItems: new Set(),
    lastSuggestionTime: 0
};

let orderBasket = { items: [], total: 0 };

// ==================== CHAT UI ====================
function toggleChat() {
    const win = document.getElementById('chat-window');
    if (!win) return;

    win.classList.toggle('hidden');

    if (!win.classList.contains('hidden') && isFirstOpen) {
        setTimeout(() => {
            addBotMessage("Hello! ☕ I'm your KRĀV AI Barista.<br>How can I help you today?");
            isFirstOpen = false;
        }, 500);
    }
}

function addBotMessage(text) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    container.innerHTML += `
        <div class="flex gap-3 mb-4">
            <div class="w-8 h-8 bg-black text-white rounded-2xl flex items-center justify-center text-xl">☕</div>
            <div class="bg-white border rounded-3xl px-5 py-4 max-w-[85%] text-sm">${text}</div>
        </div>`;
    container.scrollTop = container.scrollHeight;
}

// ==================== AI FEATURES ====================

// Mood Detection
function detectMood(text) {
    const scores = {
        happy: (text.match(/\b(great|love|awesome|yum|perfect|yes|thanks|wow)\b/gi) || []).length,
        hungry: (text.match(/\b(hungry|starving|food|eat|craving)\b/gi) || []).length,
        rushed: (text.match(/\b(quick|fast|hurry|now|urgent|pls)\b/gi) || []).length,
        group: (text.match(/\b(group|family|friends|couple|date)\b/gi) || []).length
    };
    const max = Math.max(...Object.values(scores));
    return Object.keys(scores).find(k => scores[k] === max) || 'neutral';
}

// Weather Suggestion (mock)
async function getWeatherSuggestion() {
    const temp = 32;
    return temp > 30 ? "🌞 HOT DAY: Try Java Chips Frappe (₱205)!" : null;
}

// Vibe Matching
function matchVibe(text) {
    if (/\b(date|romantic)\b/.test(text)) return "💕 Perfect for a date: Spanish Latte + cozy corner";
    if (/\b(work|study)\b/.test(text)) return "💼 Work mode: Americano + outlet seat";
    if (/\b(group|family)\b/.test(text)) return "👨‍👩‍👦 Group meal: Breakfast Feast!";
    return null;
}

// ==================== MENU ====================
const menu = {
    breakfast: {
        name: "🥞 Breakfast",
        items: [
            { name: "Tapsilog", price: 265 },
            { name: "Pancake & Sausage", price: 285 },
            { name: "Breakfast Feast ⭐", price: 345 }
        ]
    },
    drinks: {
        name: "☕ Drinks",
        items: [
            { name: "Americano", price: 130 },
            { name: "Spanish Latte", price: 165 },
            { name: "Java Chips Frappe ⭐", price: 205 }
        ]
    }
};

// ==================== HOURS ====================
function getCurrentHours() {
    const now = new Date().getHours();
    return now >= 10 && now < 22
        ? "✅ We're OPEN until 10PM!"
        : "🔒 We're CLOSED. Open at 10AM.";
}

// ==================== AI BRAIN ====================
async function getBotResponse(input) {
    const text = input.toLowerCase().trim();
    chatMemory.conversationCount++;

    const mood = detectMood(text);

    // ================= SMART GREETING =================
    if (/\b(hi|hello|hey|good morning|good evening)\b/.test(text)) {
        return `👋 Welcome to KRĀV Cafe ☕

🔥 Best Sellers:
• Breakfast Feast ⭐ (₱345)
• Spanish Latte (₱165)
• Java Chips Frappe ⭐ (₱205)

👉 Tell me what you’re craving:
🍰 sweet | ☕ coffee | 🍽️ meal`;
    }

    // ================= SMART HUNGER MODE =================
    if (mood === "hungry") {
        return `🍽️ You sound hungry 😄

🔥 Recommended:
• Breakfast Feast ⭐ (₱345)
• Burger Steak (₱245)
• Java Chips Frappe ⭐ (₱205)

👉 Light snack or full meal?`;
    }

    // ================= SMART ITEM PRICE LOOKUP =================
    if (/\b(price|how much|magkano|pila)\b/.test(text)) {

        for (let cat in menu) {
            for (let item of menu[cat].items) {
                const name = item.name.toLowerCase();

                if (text.includes(name) || name.split(" ")[0] && text.includes(name.split(" ")[0])) {
                    return `💰 ${item.name} costs ₱${item.price}`;
                }
            }
        }

        if (text.includes("fries")) {
            return `🍟 Fries: ₱120–₱150 depending on size`;
        }

        return `💰 I couldn't find that item.

Try:
• "price of latte"
• "how much tapsilog"`;
    }

    // ================= SMART CATEGORY DETECTION =================
    const categories = {
        breakfast: /\b(breakfast|silog|almusal|pancake)\b/,
        drinks: /\b(coffee|kape|latte|frappe|drink)\b/,
        rice: /\b(rice|kanin|bangus|steak)\b/,
        pasta: /\b(pasta|carbonara)\b/
    };

    for (let cat in categories) {
        if (categories[cat].test(text)) {
            chatMemory.lastCategory = cat;

            return `📋 ${menu[cat].name}

${menu[cat].items.map((i, idx) => `${idx + 1}. ${i.name} (₱${i.price})`).join("\n")}

👉 Try: "price of [item]" or "recommend"`;
        }
    }

    // ================= SMART RECOMMENDATION ENGINE =================
    if (/\b(recommend|suggest|best|ano masarap|what should i get)\b/.test(text)) {

        let rec = [];

        if (text.includes("sweet") || mood === "happy") {
            rec.push("🍫 Java Chips Frappe ⭐ (₱205)");
            rec.push("🥞 Pancake & Sausage (₱285)");
        }

        if (text.includes("coffee") || text.includes("kape")) {
            rec.push("☕ Spanish Latte (₱165)");
            rec.push("☕ Americano (₱130)");
        }

        if (rec.length === 0) {
            rec = [
                "🔥 Breakfast Feast ⭐ (₱345)",
                "🍫 Java Chips Frappe ⭐ (₱205)",
                "☕ Spanish Latte (₱165)"
            ];
        }

        return `🔥 KRĀV Recommendations:

${rec.join("\n")}

👉 Want it:
• cheaper 💰
• sweeter 🍰
• or heavier 🍽️?`;
    }

    // ================= ORDER SYSTEM (FIXED + SAFER) =================
    for (let cat in menu) {
        for (let item of menu[cat].items) {
            const cleanName = item.name.toLowerCase().replace(/[^a-z]/g, '');
            if (text.replace(/\s/g, '').includes(cleanName)) {

                orderBasket.items.push(item);
                orderBasket.total += item.price;

                return `✅ Added ${item.name} (₱${item.price})

🧺 Total: ₱${orderBasket.total}

👉 Want a drink pairing? ☕`;
            }
        }
    }

    // ================= HOURS =================
    if (/\b(open|close|time|hour)\b/.test(text)) {
        return getCurrentHours();
    }

    // ================= LOCATION =================
    if (/\b(where|location|address)\b/.test(text)) {
        return `📍 KRĀV Cafe

57 Brgy. Santor, Tanauan City

👉 Search "KRĀV Cafe" on Google Maps`;
    }

    // ================= FALLBACK (SMART GUIDE) =================
    return `☕ I’m KRĀV AI Barista.

Try asking:
🍽️ "recommend something"
☕ "best coffee"
🍰 "something sweet"
💰 "price of latte"
📋 "menu"

Or just tell me your mood 😄`;
}
// ==================== CHAT ENGINE ====================
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const container = document.getElementById('chat-messages');

    if (!input || !container) return;

    const msg = input.value.trim();
    if (!msg) return;

    container.innerHTML += `
        <div class="flex justify-end mb-4">
            <div class="bg-black text-white rounded-3xl px-5 py-4 max-w-[85%] text-sm">${msg}</div>
        </div>`;

    input.value = '';
    container.scrollTop = container.scrollHeight;

    setTimeout(async () => {
        const reply = await getBotResponse(msg);

        container.innerHTML += `
            <div class="flex gap-3 mb-4">
                <div class="w-8 h-8 bg-black text-white rounded-2xl flex items-center justify-center text-xl">☕</div>
                <div class="bg-white border rounded-3xl px-5 py-4 max-w-[85%] text-sm">
                    ${reply.replace(/\n/g, '<br>')}
                </div>
            </div>`;

        container.scrollTop = container.scrollHeight;
    }, 600);
}

// ==================== MAP ====================
function initMap() {
    const el = document.getElementById('map-container');
    if (!el) return;

    const map = L.map(el).setView([14.0929, 121.1145], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    L.marker([14.0929, 121.1145]).addTo(map)
        .bindPopup("KRĀV Cafe")
        .openPopup();
}

// ==================== STATUS ====================
function updateCafeStatus() {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (!dot || !text) return;

    const now = new Date().getHours();
    const isOpen = now >= 10 && now < 22;

    dot.className = `w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`;
    text.innerText = isOpen ? "Open Now" : "Closed";
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    updateCafeStatus();
    setInterval(updateCafeStatus, 60000);

    const input = document.getElementById('chat-input');
    if (input) {
        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }

    setTimeout(() => {
        addBotMessage("Welcome to KRĀV Cafe! ☕ Ask me anything.");
    }, 800);
});