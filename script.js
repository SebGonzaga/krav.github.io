// ==================== CONFIGURATION ====================
const OPENAI_API_KEY = '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'; // ⚠️ Replace this before going live

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

// ==================== CHAT HISTORY ====================
let chatHistory = [];

// ==================== OPEN HOURS ====================
function getCafeStatus() {
    const now = new Date();
    const day = now.getDay();
    const timeInMinutes = now.getHours() * 60 + now.getMinutes();
    const T = { open10: 600, open7: 420, close22: 1320, close24: 1440 };
    if (day >= 1 && day <= 4) return timeInMinutes >= T.open10 && timeInMinutes < T.close22;
    if (day === 5) return timeInMinutes >= T.open10 && timeInMinutes < T.close24;
    if (day === 6) return timeInMinutes >= T.open7 && timeInMinutes < T.close24;
    if (day === 0) return timeInMinutes >= T.open7 && timeInMinutes < T.close22;
    return false;
}

function updateCafeStatus() {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (!dot || !text) return;
    const isOpen = getCafeStatus();
    dot.className = `w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`;
    text.textContent = isOpen ? 'Open Now' : 'Closed';
}

// ==================== OPENAI CHAT ====================
async function getBotResponse(userMessage) {
    chatHistory.push({ role: 'user', content: userMessage });

    // Keep history to last 20 messages to avoid token bloat
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                max_tokens: 300,
                temperature: 0.7,
                messages: [
                    { role: 'system', content: BARISTA_SYSTEM_PROMPT },
                    ...chatHistory
                ]
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error('OpenAI error:', err);
            return "Oops, I ran into a little hiccup on my end! Please try again in a moment ☕";
        }

        const data = await response.json();
        const reply = data.choices[0].message.content.trim();

        chatHistory.push({ role: 'assistant', content: reply });
        return reply;

    } catch (error) {
        console.error('Network error:', error);
        return "Hmm, I seem to have lost my connection! Give it another shot in a bit 😊";
    }
}

// ==================== GALLERY TABS ====================
let galleryItems = null;

function switchGalleryTab(category) {
    document.querySelectorAll('.gallery-tab').forEach(tab => tab.classList.remove('active-tab'));
    document.getElementById(`tab-${category}`).classList.add('active-tab');

    if (!galleryItems) galleryItems = [...document.querySelectorAll('#gallery-grid .gallery-item')];

    galleryItems.forEach(item => {
        item.classList.add('hidden-item');
        item.classList.remove('entering');
    });

    const visible = galleryItems.filter(item => {
        return category === 'all' || item.getAttribute('data-category') === category;
    });

    visible.forEach((item, i) => {
        setTimeout(() => {
            item.classList.remove('hidden-item');
            item.classList.add('entering');
        }, i * 60);
    });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            closeMobileMenu();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== NAVBAR SCROLL ====================
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            const navbar = document.getElementById('navbar');
            if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// ==================== MOBILE MENU ====================
let mobileMenuEl, hamburgerBtn, hamburgerIcon;

function openMobileMenu() {
    if (!mobileMenuEl) return;
    mobileMenuEl.classList.add('open');
    hamburgerBtn.classList.add('active');
    hamburgerIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>`;
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    if (!mobileMenuEl) return;
    mobileMenuEl.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
    document.body.style.overflow = '';
}

function toggleMobileMenu() {
    mobileMenuEl?.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
}

// ==================== MENU SCROLL ====================
function scrollMenuLeft() {
    document.getElementById('menu-scroll')?.scrollBy({ left: -400, behavior: 'smooth' });
}
function scrollMenuRight() {
    document.getElementById('menu-scroll')?.scrollBy({ left: 400, behavior: 'smooth' });
}

// ==================== CHAT UI ====================
let chatMessagesEl, chatInputEl;
let isFirstOpen = true;
let isSending = false;

function toggleChat() {
    const win = document.getElementById('chat-window');
    if (!win) return;
    const isHidden = win.classList.contains('chat-hidden');
    if (isHidden) {
        win.classList.remove('chat-hidden');
        if (isFirstOpen) {
            setTimeout(() => addBotMessage("Kamusta! ☕ I'm Krav, your KRĀV Cafe AI barista! Ask me about our menu, hours, allergies, or anything about the cafe. What can I get you?"), 300);
            isFirstOpen = false;
        }
        setTimeout(() => chatInputEl?.focus(), 300);
    } else {
        win.classList.add('chat-hidden');
    }
}

function addBotMessage(text) {
    if (!chatMessagesEl) return;
    const div = document.createElement('div');
    div.className = 'flex gap-3 mb-4';
    const icon = document.createElement('div');
    icon.className = 'w-8 h-8 bg-black text-white rounded-2xl flex items-center justify-center text-xl flex-shrink-0';
    icon.textContent = '☕';
    const bubble = document.createElement('div');
    bubble.className = 'bg-white border rounded-3xl px-5 py-4 max-w-[85%] text-sm whitespace-pre-wrap';
    bubble.textContent = text;
    div.appendChild(icon);
    div.appendChild(bubble);
    chatMessagesEl.appendChild(div);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

async function sendChatMessage() {
    if (!chatInputEl || !chatMessagesEl || isSending) return;

    const msg = chatInputEl.value.trim();
    if (!msg) return;

    isSending = true;

    // User bubble
    const userDiv = document.createElement('div');
    userDiv.className = 'flex justify-end mb-4';
    const userBubble = document.createElement('div');
    userBubble.className = 'bg-black text-white rounded-3xl px-5 py-4 max-w-[85%] text-sm';
    userBubble.textContent = msg;
    userDiv.appendChild(userBubble);
    chatMessagesEl.appendChild(userDiv);

    chatInputEl.value = '';
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'flex gap-3 mb-4';
    typing.innerHTML = `
        <div class="w-8 h-8 bg-black text-white rounded-2xl flex items-center justify-center text-xl flex-shrink-0">☕</div>
        <div class="bg-white border rounded-3xl px-5 py-4 max-w-[85%] text-sm">
            <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.2s"></div>
            </div>
        </div>`;
    chatMessagesEl.appendChild(typing);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

    const reply = await getBotResponse(msg);
    chatMessagesEl.removeChild(typing);
    addBotMessage(reply);

    isSending = false;
}

// ==================== MAP ====================
function initMap() {
    const el = document.getElementById('map-container');
    if (!el || typeof L === 'undefined') return;
    const kravCafe = [14.090313810454433, 121.12071730320226];
    const map = L.map(el).setView(kravCafe, 19);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    L.marker(kravCafe).addTo(map).bindPopup("☕ KRĀV Cafe").openPopup();
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {

    // Cache DOM
    mobileMenuEl  = document.getElementById('mobile-menu');
    hamburgerBtn  = document.getElementById('hamburger-btn');
    hamburgerIcon = document.getElementById('hamburger-icon');
    chatMessagesEl = document.getElementById('chat-messages');
    chatInputEl    = document.getElementById('chat-input');

    // Gallery tabs
    document.getElementById('tab-all')?.addEventListener('click', () => switchGalleryTab('all'));
    document.getElementById('tab-interior')?.addEventListener('click', () => switchGalleryTab('interior'));
    document.getElementById('tab-exterior')?.addEventListener('click', () => switchGalleryTab('exterior'));
    document.getElementById('tab-food')?.addEventListener('click', () => switchGalleryTab('food'));

    // Hamburger
    hamburgerBtn?.addEventListener('click', toggleMobileMenu);

    // Menu scroll buttons
    document.getElementById('menu-left-btn')?.addEventListener('click', scrollMenuLeft);
    document.getElementById('menu-right-btn')?.addEventListener('click', scrollMenuRight);

    // Chat triggers
    document.getElementById('chat-fab')?.addEventListener('click', toggleChat);
    document.getElementById('chat-close-btn')?.addEventListener('click', toggleChat);
    document.getElementById('chat-toggle-hero')?.addEventListener('click', toggleChat);

    // Chat send
    document.getElementById('chat-send-btn')?.addEventListener('click', sendChatMessage);
    chatInputEl?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) sendChatMessage();
    });

    // Map (lazy — wait for Leaflet)
    const tryInitMap = () => typeof L !== 'undefined' ? initMap() : setTimeout(tryInitMap, 200);
    setTimeout(tryInitMap, 100);

    // Cafe status
    updateCafeStatus();
    const statusInterval = setInterval(updateCafeStatus, 60000);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) updateCafeStatus();
    });
});