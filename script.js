// --- Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Mobile Menu ---
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

// --- Menu Horizontal Scroll ---
function scrollMenuLeft() {
    const container = document.getElementById('menu-scroll');
    container.scrollBy({ left: -400, behavior: 'smooth' });
}

function scrollMenuRight() {
    const container = document.getElementById('menu-scroll');
    container.scrollBy({ left: 400, behavior: 'smooth' });
}

// --- Gallery Modal ---
function showImageModal(id) {
    const modal = document.getElementById('image-modal');
    const img = document.getElementById('modal-image');
    const caption = document.getElementById('modal-caption');

    const images = {
        1: { src: "https://picsum.photos/id/1015/1200/900", cap: "Cozy corner" },
        2: { src: "https://picsum.photos/id/201/1200/900", cap: "Perfect pour" },
        3: { src: "https://picsum.photos/id/1005/1200/900", cap: "Minimal seating" },
        4: { src: "https://picsum.photos/id/133/1200/900", cap: "Fresh pastries" }
    };

    if (images[id]) {
        img.src = images[id].src;
        caption.textContent = images[id].cap;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function hideImageModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// --- SMART KRĀV AI BARISTA ---
let isFirstOpen = true;

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

    const messageHTML = `
        <div class="flex gap-3 mb-4">
            <div class="w-8 h-8 bg-black text-white rounded-2xl flex items-center justify-center flex-shrink-0 text-xl">☕</div>
            <div class="bg-white border border-black/10 rounded-3xl rounded-tl-none px-5 py-4 max-w-[85%] text-sm leading-relaxed text-black">
                ${text}
            </div>
        </div>`;
    
    container.innerHTML += messageHTML;
    container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const messageHTML = `
        <div class="flex justify-end mb-4">
            <div class="bg-black text-white rounded-3xl rounded-tr-none px-5 py-4 max-w-[85%] text-sm leading-relaxed">
                ${text}
            </div>
        </div>`;
    
    container.innerHTML += messageHTML;
    container.scrollTop = container.scrollHeight;
}

// ==================== SMART KRĀV AI BARISTA ====================

function getBotResponse(input) {
    const text = input.toLowerCase().trim();

    // Expanded keyword scoring for a smarter brain
    const scores = {
        hours: (text.match(/\b(open|close|hour|time|schedule|late|until|today|now)\b/g) || []).length,
        menu: (text.match(/\b(menu|drink|coffee|recommend|suggest|best|popular|order|food)\b/g) || []).length,
        location: (text.match(/\b(where|location|address|direction|map|tanauan|how to get)\b/g) || []).length,
        amenities: (text.match(/\b(wifi|internet|parking|seat|table|capacity|outlet|plug|charge|laptop|pet|dog|cat)\b/g) || []).length,
        contact: (text.match(/\b(contact|phone|call|number|facebook|instagram|fb|ig|email)\b/g) || []).length,
        delivery: (text.match(/\b(grab|delivery|deliver|online|order|app)\b/g) || []).length,
        about: (text.match(/\b(info|detail|about|krav|cafe|shop|overview)\b/g) || []).length
    };

    // --- GREETINGS ---
    if (text.match(/\b(hi|hello|hey|yo|morning|evening|afternoon)\b/)) {
        return "Hey there! ☕ Welcome to KRĀV Cafe. I'm here to help you navigate our menu or find the perfect spot to work. What can I get started for you?";
    }

    // --- CONTACT & SOCIALS ---
    if (scores.contact > 0) {
        return `We'd love to stay connected! 📱<br><br>
        • Phone: 0917 123 4567<br>
        • Facebook: facebook.com/kravcafetanauan<br>
        • Instagram: @kravcafe.tanauan<br><br>
        Drop us a follow for the latest brew updates!`;
    }

    // --- DELIVERY & DRIVE THRU ---
    if (scores.delivery > 0 || text.includes("drive")) {
        return `On the move? We've got you covered! 🚗💨<br><br>
        You can find us on GrabFood (search "KRĀV Cafe - Tanauan") or swing by our Drive-thru for a quick caffeine fix. Speed and quality, served fresh!`;
    }

    // --- HOURS ---
    if (scores.hours > 0) {
        const now = new Date();
        const day = now.getDay();
        let hours = "";
        if (day >= 1 && day <= 4) hours = "10AM – 10PM";
        else if (day === 5) hours = "10AM – 12MN";
        else if (day === 6) hours = "7AM – 12MN";
        else hours = "7AM – 10PM";

        return `Great timing! ⏰ Today, we're serving until ${hours}.<br>
        <br>Our Weekly Rhythm:<br>
        • Mon–Thu: 10AM–10PM<br>
        • Fri: 10AM–12MN<br>
        • Sat: 7AM–12MN<br>
        • Sun: 7AM–10PM`;
    }

    // --- AMENITIES ---
    if (scores.amenities > 0) {
        let response = "We've built KRĀV to be your second home. Check out our features: ✨<br><br>";
        if (text.includes("wifi")) response += "• Stay connected with Free high-speed WiFi 📶<br>";
        if (text.includes("parking")) response += "• We have 20 dedicated slots waiting for you 🅿️<br>";
        if (text.includes("seat") || text.includes("capacity")) response += "• Space for 77 guests across our industrial lounge 💺<br>";
        if (text.includes("outlet") || text.includes("plug") || text.includes("charge") || text.includes("laptop")) {
            response += "• Power outlets are available at most tables for your deep-work sessions 🔌<br>";
        }
        if (text.includes("pet") || text.includes("dog") || text.includes("cat")) {
            response += "• Your furry friends are more than welcome here! 🐾<br>";
        }
        return response;
    }

    // --- ABOUT THE CAFE ---
    if (scores.about > 0) {
        return `KRĀV Cafe is where Industrial Soul meets premium coffee. ☕<br><br>
        Think noir vibes, 77 comfortable seats, and everything you need for a chill session or a productive workday. We’re pet-friendly, work-ready, and located right in the heart of Tanauan.`;
    }

    // --- MENU & RECS ---
    if (scores.menu > 0) {
        if (text.includes("strong") || text.includes("black")) {
            return "In need of a real kick? ☕ Try our Signature Pour Over or Cold Brew. They're bold, clean, and strictly for the coffee purists.";
        }
        return "Our current favorites are the KRĀV Flat White and the Signature Pour Over. Are you in the mood for something creamy, or do you prefer it black?";
    }

    // --- LOCATION ---
    if (scores.location > 0) {
        return "📍 Find us at 57 Brgy. Santor, Tanauan City, Batangas. We're easy to find on Waze or Google Maps. See you at the bar!";
    }

    return "I'm not quite sure about that one, but I can definitely talk coffee, WiFi, parking, or our location! What's on your mind? ☕";
}

// ==================== CORE CHAT FUNCTIONS ====================

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const container = document.getElementById('chat-messages');

    if (!input || !container) return;

    const msg = input.value.trim();
    if (!msg) return;

    // 1. Add User Message
    const userHTML = `
        <div class="flex justify-end mb-4">
            <div class="bg-black text-white rounded-3xl rounded-tr-none px-5 py-4 max-w-[85%] text-sm leading-relaxed">
                ${msg}
            </div>
        </div>`;
    container.innerHTML += userHTML;
    
    // Clear input and scroll
    input.value = '';
    container.scrollTop = container.scrollHeight;

    // 2. Add Bot Response with "Thinking" delay
    setTimeout(() => {
        const reply = getBotResponse(msg);
        const botHTML = `
            <div class="flex gap-3 mb-4">
                <div class="w-8 h-8 bg-black text-white rounded-2xl flex items-center justify-center flex-shrink-0 text-xl">☕</div>
                <div class="bg-white border border-black/10 rounded-3xl rounded-tl-none px-5 py-4 max-w-[85%] text-sm leading-relaxed text-black">
                    ${reply}
                </div>
            </div>`;
        container.innerHTML += botHTML;
        container.scrollTop = container.scrollHeight;
    }, 600);
}

// ==================== EVENT INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    
    if (chatInput) {
        // Listen for "Enter" key
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
});

// Add event listener for Enter key in chat
document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});

// --- Leaflet Map ---
function initMap() {
    const mapEl = document.getElementById('map-container');
    if (!mapEl) return;

    const santorCoords = [14.0929, 121.1145];
    const map = L.map(mapEl, {
        scrollWheelZoom: true,
        touchZoom: true,
        zoomControl: true
    }).setView(santorCoords, 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    L.marker(santorCoords).addTo(map)
        .bindPopup('<b>KRĀV Cafe Tanauan</b><br>57 Brgy. Santor')
        .openPopup();
        
    setTimeout(() => { map.invalidateSize(); }, 500);
}

// --- Cafe Status ---
function updateCafeStatus() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hour + minutes / 60;

    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    if (!statusDot || !statusText) return;

    let isOpen = false;

    if (day >= 1 && day <= 4) { if (currentTime >= 10 && currentTime < 22) isOpen = true; } 
    else if (day === 5) { if (currentTime >= 10 && currentTime < 24) isOpen = true; } 
    else if (day === 6) { if (currentTime >= 7 && currentTime < 24) isOpen = true; } 
    else if (day === 0) { if (currentTime >= 7 && currentTime < 22) isOpen = true; }

    if (isOpen) {
        statusDot.className = "w-2 h-2 rounded-full animate-pulse bg-green-500";
        statusText.innerText = "Open Now";
        statusText.className = "text-[10px] font-bold uppercase tracking-tighter text-green-600";
    } else {
        statusDot.className = "w-2 h-2 rounded-full bg-red-500";
        statusText.innerText = "Closed";
        statusText.className = "text-[10px] font-bold uppercase tracking-tighter text-red-600";
    }
}

// --- Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("%c☕ KRĀV Cafe Tanauan - Ready", "color:#111;font-weight:bold");
    initMap();
    updateCafeStatus();
    setInterval(updateCafeStatus, 60000);
});
// --- Enhanced Gallery Logic ---
function showImageModal(id) {
    const modal = document.getElementById('image-modal');
    const img = document.getElementById('modal-image');
    const caption = document.getElementById('modal-caption');

    // Updated with your actual "Noir" project vibes
    const images = {
        1: { src: "https://picsum.photos/id/1015/1200/900", cap: "Industrial Interior - Main Hall" },
        2: { src: "https://picsum.photos/id/201/1200/900", cap: "Precision Pour Over - Signature Series" },
        3: { src: "https://picsum.photos/id/1005/1200/900", cap: "Minimalist Japandi Seating Area" },
        4: { src: "https://picsum.photos/id/133/1200/900", cap: "Handcrafted Pastries - Daily Fresh" }
    };

    if (images[id]) {
        img.src = images[id].src;
        caption.textContent = images[id].cap;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when viewing image
    }
}

function hideImageModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto'; // Restore scroll
}

// Close Modal or Chat on "Escape" key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideImageModal();
        const win = document.getElementById('chat-window');
        if (win && !win.classList.contains('hidden')) toggleChat();
    }
});
// Add this inside your initMap function replace the standard marker
const customPopup = `
    <div class="p-2">
        <h3 class="font-bold text-lg mb-1">KRĀV CAFE</h3>
        <p class="text-xs uppercase tracking-widest opacity-60">Industrial Soul • Tanauan</p>
        <hr class="my-2 border-black/10">
        <p class="text-xs">57 Brgy. Santor, Tanauan City</p>
    </div>
`;

L.marker(santorCoords).addTo(map)
    .bindPopup(customPopup)
    .openPopup();