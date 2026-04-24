// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ==================== NAVBAR SCROLL ====================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
});

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('hamburger-btn');
    const icon = document.getElementById('hamburger-icon');

    if (!menu || !btn || !icon) return;

    const isOpen = menu.classList.contains('open');
    
    if (isOpen) {
        menu.classList.remove('open');
        btn.classList.remove('active');
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
        document.body.style.overflow = '';
    } else {
        menu.classList.add('open');
        btn.classList.add('active');
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6h12v12"/>`;
        document.body.style.overflow = 'hidden';
    }
}

// ==================== MENU SCROLL ====================
function scrollMenuLeft() {
    document.getElementById('menu-scroll')?.scrollBy({ left: -400, behavior: 'smooth' });
}
function scrollMenuRight() {
    document.getElementById('menu-scroll')?.scrollBy({ left: 400, behavior: 'smooth' });
}

// ==================== SUPER SMART CHAT MEMORY ====================
let chatMemory = {
    conversationCount: 0,
    allergies: [],
    orderBasket: { items: [], total: 0 },
    conversationHistory: [],
    userMood: null,
    userBudget: 300,
    groupSize: 1,
    visitPurpose: null,
    lastCategory: null,
    lastItem: null,
    isFirstOpen: true
};

// ==================== ENHANCED MENU WITH PERSONALITY ====================
const menu = {
    breakfast: {
        name: "🥞 Breakfast",
        items: [
            { name: "Tapsilog", price: 265, tags: ["savory", "rice", "hearty", "pinoy"], personality: "Classic Pinoy breakfast power!" },
            { name: "Pancake & Sausage", price: 285, tags: ["sweet", "comfort"], personality: "Fluffy + juicy = weekend bliss!" },
            { name: "Breakfast Feast ⭐", price: 345, tags: ["feast", "shareable", "bestseller"], personality: "Barkada/Family STAR meal!" }
        ]
    },
    drinks: {
        name: "☕ Drinks",
        items: [
            { name: "Americano", price: 130, tags: ["black", "strong", "work", "budget"], personality: "Bold work/study fuel ☕" },
            { name: "Spanish Latte", price: 165, tags: ["creamy", "sweet", "date"], personality: "TikTok-famous date night pick 💕" },
            { name: "Java Chips Frappe ⭐", price: 205, tags: ["dessert", "treat", "bestseller"], personality: "Chocolate heaven! #1 seller 🍫" }
        ]
    },
    riceMeals: {
        name: "🍚 Rice Meals",
        items: [
            { name: "Bangus Sisig", price: 295, tags: ["seafood", "spicy"], personality: "Crispy milkfish punch! 🌶️" },
            { name: "Pork Steak", price: 275, tags: ["savory", "comfort"], personality: "Tender home-cooked vibes 🥩" }
        ]
    }
};

// ==================== ULTRA-SMART NLP ====================
function analyzeInput(text) {
    const lowerText = text.toLowerCase();
    
    return {
        mood: detectMood(lowerText),
        intent: detectIntent(lowerText),
        itemName: extractItemName(lowerText),
        quantity: extractQuantity(lowerText),
        budget: extractBudget(lowerText),
        groupSize: extractGroupSize(lowerText),
        purpose: extractPurpose(lowerText),
        allergies: extractAllergies(lowerText)
    };
}

function detectMood(text) {
    const moods = {
        excited: (text.match(/(great|love|awesome|yum|perfect|wow|masarap|yummy)/gi) || []).length,
        hungry: (text.match(/(hungry|gutom|starving|craving|lisud na)/gi) || []).length,
        rushed: (text.match(/(quick|fast|hurry|rush|now|bilis)/gi) || []).length,
        chill: (text.match(/(chill|relax|cozy|tahimik)/gi) || []).length,
        romantic: (text.match(/(date|romantic|gf|bf)/gi) || []).length,
        budget: (text.match(/(cheap|murah|budget)/gi) || []).length,
        group: (text.match(/(group|family|friends|barkada)/gi) || []).length
    };
    
    const maxMood = Object.entries(moods).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    return maxMood || 'neutral';
}

function detectIntent(text) {
    return {
        greeting: /\b(hi|hello|hey|kamusta|good (morning|afternoon))/i.test(text),
        menu: /\b(menu|what (do you )?have|ano meron)/i.test(text),
        recommend: /\b(recommend|suggest|best|ano (masarap|recommend))/i.test(text),
        price: /\b(price|how much|magkano|pila)/i.test(text),
        order: /\b(order|give me|ako na)/i.test(text),
        allergy: /\b(allerg(y|ic)|no (seafood|fish))/i.test(text),
        location: /\b(where|location|saan)/i.test(text),
        hours: /\b(open|close|time|hour)/i.test(text)
    };
}

function extractItemName(text) {
    for (let cat in menu) {
        for (let item of menu[cat].items) {
            if (text.includes(item.name.toLowerCase()) || 
                item.tags.some(tag => text.includes(tag))) {
                return item.name;
            }
        }
    }
    return null;
}

function extractQuantity(text) {
    const nums = text.match(/(\d+|one|dalawa)/i);
    const numMap = { 'one': 1, 'dalawa': 2 };
    return nums ? (numMap[nums[1].toLowerCase()] || parseInt(nums[1])) : 1;
}

function extractBudget(text) {
    if (text.includes('cheap')) return 150;
    const num = text.match(/under (\d+)/i);
    return num ? parseInt(num[1]) : 300;
}

function extractGroupSize(text) {
    const size = text.match(/(\d+) (people|person)/i);
    return size ? parseInt(size[1]) : 1;
}

function extractPurpose(text) {
    if (text.includes('work') || text.includes('study')) return 'work';
    if (text.includes('date')) return 'date';
    if (text.includes('family') || text.includes('barkada')) return 'group';
    return null;
}

function extractAllergies(text) {
    return text.includes('seafood') || text.includes('fish') ? ['seafood'] : [];
}

// ==================== GENIUS RECOMMENDATION ENGINE ====================
function getGeniusRecommendations(context) {
    const { mood, budget, allergies = [] } = context;
    
    const safeItems = [];
    for (let cat in menu) {
        menu[cat].items.forEach(item => {
            if (!allergies.some(a => item.tags?.includes(a))) {
                safeItems.push({ ...item, category: cat });
            }
        });
    }
    
    let recommendations = safeItems.filter(i => i.price <= budget);
    
    // Mood-based filtering
    if (mood === 'excited' || mood === 'chill') {
        recommendations = recommendations.filter(i => i.tags?.some(t => 
            ['sweet', 'creamy', 'bestseller'].includes(t)
        ));
    } else if (mood === 'hungry') {
        recommendations = recommendations.filter(i => !i.tags?.includes('drink'));
    } else if (mood === 'budget') {
        recommendations.sort((a, b) => a.price - b.price);
    }
    
    return recommendations.slice(0, 3);
}

function getPairingSuggestion(itemName) {
    const pairings = {
        'Tapsilog': 'Americano ☕',
        'Pancake & Sausage': 'Java Chips Frappe 🍫',
        'Americano': 'Tapsilog',
        'Java Chips Frappe': 'Pancake & Sausage 🥞'
    };
    return pairings[itemName] || 'house blend coffee ☕';
}

// ==================== ULTIMATE AI BRAIN ====================
async function getBotResponse(input) {
    const analysis = analyzeInput(input);
    
    // Update memory
    Object.assign(chatMemory, {
        userMood: analysis.mood,
        userBudget: analysis.budget,
        allergies: [...new Set([...chatMemory.allergies, ...analysis.allergies])],
        lastCategory: analysis.itemName ? chatMemory.lastCategory : analysis.intent.menu ? 'general' : chatMemory.lastCategory,
        lastItem: analysis.itemName
    });
    
    chatMemory.conversationCount++;
    chatMemory.conversationHistory.push({ user: input, analysis });
    
    // ==================== GREETING ====================
    if (analysis.intent.greeting) {
        const recs = getGeniusRecommendations(chatMemory);
        return `👋 Kamusta! ☕ KRĀV AI Barista here!

${getCurrentHours()}

**Quick picks for you:**
${recs.map((r,i) => `${i+1}. ${r.name} ₱${r.price}`).join('\n')}

What can I get you? 😊`;
    }
    
    // ==================== ITEM ORDERING ====================
    if (analysis.itemName) {
        const item = Object.values(menu).flatMap(c => c.items).find(i => i.name === analysis.itemName);
        const qty = analysis.quantity;
        
        if (analysis.intent.order) {
            chatMemory.orderBasket.items.push({ name: item.name, price: item.price, qty });
            chatMemory.orderBasket.total += item.price * qty;
            
            return `✅ ${qty}x ${item.name} added! (₱${(item.price*qty).toLocaleString()})

**Basket:** ${chatMemory.orderBasket.items.length} items | ₱${chatMemory.orderBasket.total.toLocaleString()}
${getPairingSuggestion(item.name)}

More items or checkout?`;
        }
        
        return `**${item.name}** ₱${item.price}
${item.personality}

Say "${item.name.toLowerCase()}" to order!`;
    }
    
    // ==================== RECOMMENDATIONS ====================
    if (analysis.intent.recommend || analysis.mood === 'hungry') {
        const recs = getGeniusRecommendations(chatMemory);
        return `🔥 **Perfect for ${analysis.mood} mood!**

${recs.map((r,i) => `${i+1}. **${r.name}** ₱${r.price}\n${r.personality}`).join('\n\n')}

Say "order #1" to add!`;
    }
    
    // ==================== PRICE ====================
    if (analysis.intent.price) {
        return analysis.itemName 
            ? `💰 **${analysis.itemName}: ₱${Object.values(menu).flatMap(c => c.items).find(i => i.name === analysis.itemName)?.price}`
            : `💰 What item? "price of Java Chips"`;
    }
    
    // ==================== ALLERGY ====================
    if (analysis.intent.allergy) {
        return `✅ **Allergy-safe picks** (no seafood):

${getGeniusRecommendations({...chatMemory, allergies: ['seafood']}).map(r => `• ${r.name} ₱${r.price}`).join('\n')}`;
    }
    
    // ==================== LOCATION ====================
    if (analysis.intent.location) {
        return `📍 **KRĀV Cafe**
57 Brgy. Santor, Tanauan City, Batangas

🗺️ Search "KRĀV Cafe Tanauan"
${getCurrentHours()}`;
    }
    
    // ==================== HOURS ====================
    if (analysis.intent.hours) {
        return getCurrentHours();
    }
    
    // ==================== MENU CATEGORIES ====================
    for (let cat in menu) {
        if (input.toLowerCase().includes(cat)) {
            return `📋 **${menu[cat].name}**
${menu[cat].items.map((i,idx) => `${idx+1}. ${i.name} ₱${i.price}`).join('\n')}`;
        }
    }
    
    // ==================== FALLBACK ====================
    return `🤖 **KRĀV AI Barista**

Try:
- "recommend something"
- "show breakfast" 
- "cheap coffee"
- "order Java Chips"

Or tell me your mood! 😋`;
}

// ==================== ENHANCED CHAT UI ====================
function toggleChat() {
    const win = document.getElementById('chat-window');
    if (!win) return;

    win.classList.toggle('hidden');
    
    if (!win.classList.contains('hidden') && chatMemory.isFirstOpen) {
        setTimeout(() => addBotMessage("Kamusta! ☕ Your KRĀV AI Barista. What can I get you?"), 300);
        chatMemory.isFirstOpen = false;
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

// ==================== SUPER CHAT ENGINE ====================
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const container = document.getElementById('chat-messages');

    if (!input || !container) return;

    const msg = input.value.trim();
    if (!msg) return;

    // User message
    container.innerHTML += `
        <div class="flex justify-end mb-4">
            <div class="bg-black text-white rounded-3xl px-5 py-4 max-w-[85%] text-sm">${msg}</div>
        </div>`;
    
    input.value = '';
    container.scrollTop = container.scrollHeight;

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'flex gap-3 mb-4';
    typing.innerHTML = `
        <div class="w-8 h-8 bg-black text-white rounded-2xl flex items-center justify-center text-xl">☕</div>
        <div class="bg-white border rounded-3xl px-5 py-4 max-w-[85%] text-sm">
            <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.2s"></div>
            </div>
        </div>`;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;

    // AI Response
    const reply = await getBotResponse(msg);
    container.removeChild(typing);
    
    container.innerHTML += `
        <div class="flex gap-3 mb-4">
            <div class="w-8 h-8 bg-black text-white rounded-2xl flex items-center justify-center text-xl">☕</div>
            <div class="bg-white border rounded-3xl px-5 py-4 max-w-[85%] text-sm">
                ${reply.replace(/\n/g, '<br>')}
            </div>
        </div>`;
    
    container.scrollTop = container.scrollHeight;
}

// ==================== MAP ====================
function initMap() {
    const el = document.getElementById('map-container');
    if (!el || typeof L === 'undefined') return;

    const kravCafe = [14.090506521880544, 121.12068331652362];

    const map = L.map(el).setView(kravCafe, 19); // higher zoom for precision

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker(kravCafe).addTo(map)
        .bindPopup("🎉 KRĀV Cafe - Exact Spot")
        .openPopup();
}

// ==================== STATUS ====================
function getCurrentHours() {
    const now = new Date().getHours();
    return now >= 10 && now < 22 ? "✅ OPEN until 10PM!" : "🔒 CLOSED. Opens 10AM.";
}

function updateCafeStatus() {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (!dot || !text) return;

    const now = new Date().getHours();
    const isOpen = now >= 10 && now < 22;

    dot.className = `w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`;
    text.textContent = isOpen ? "Open Now" : "Closed";
}

/// ==================== PERFECT INIT ====================
document.addEventListener('DOMContentLoaded', () => {

    // Init map safely
    if (typeof L !== 'undefined') {
        setTimeout(initMap, 100);
    }

    updateCafeStatus();
    setInterval(updateCafeStatus, 60000);

    // ==================== CHAT INPUT ====================
    const input = document.getElementById('chat-input');

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });

        // Auto-focus on chat open
        const chatToggle = document.querySelector('[onclick="toggleChat()"]');

        if (chatToggle) {
            chatToggle.addEventListener('click', () => {
                setTimeout(() => input.focus(), 300);
            });
        }
    }

    // ==================== WELCOME MESSAGE ====================
    setTimeout(() => {
        const welcomeEl = document.getElementById('welcome-message');

        if (welcomeEl) {
            welcomeEl.classList.add('fade-out');

            setTimeout(() => {
                welcomeEl.remove();
            }, 1000);
        }
    }, 2000);
});

// ==================== ORDER BASKET CONTROLS ====================
function viewBasket() {
    if (chatMemory.orderBasket.items.length === 0) {
        addBotMessage("Your basket is empty! Add items by saying 'order [item]' 😊");
        return;
    }
    
    const basketText = chatMemory.orderBasket.items.map((item, i) => 
        `${i+1}. ${item.qty}x ${item.name} - ₱${(item.price * item.qty).toLocaleString()}`
    ).join('\n');
    
    addBotMessage(`🛒 **Your Order Basket**

${basketText}

**Total: ₱${chatMemory.orderBasket.total.toLocaleString()}**

Say "clear basket" or "checkout"`);
}

function clearBasket() {
    chatMemory.orderBasket = { items: [], total: 0 };
    addBotMessage("🗑️ Basket cleared! Ready for new orders ☕");
}

// ==================== BONUS: Voice Input (Optional) ====================
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        addBotMessage("🎤 Voice input not supported on this browser");
        return;
    }
    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('chat-input').value = transcript;
        sendChatMessage();
    };
    
    recognition.onerror = () => addBotMessage("🎤 Voice input failed. Try typing!");
    recognition.start();
}

// ==================== PERFECT CSS INTEGRATION ====================
// Add these classes to your Tailwind config or CSS:
const chatStyles = `
<style>
.chat-window.hidden { display: none; }
.chat-window.open { display: block; }
.basket-btn { @apply bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition-all; }
.fade-out { animation: fadeOut 1s ease-out forwards; }
@keyframes fadeOut { to { opacity: 0; transform: translateY(-10px); } }
</style>
`;

// Auto-inject styles if needed
if (!document.querySelector('#krav-chat-styles')) {
    const style = document.createElement('style');
    style.id = 'krav-chat-styles';
    style.textContent = chatStyles;
    document.head.appendChild(style);
}