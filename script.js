// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu
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

// Menu Horizontal Scroll
function scrollMenuLeft() {
    const container = document.getElementById('menu-scroll');
    container.scrollBy({ left: -400, behavior: 'smooth' });
}

function scrollMenuRight() {
    const container = document.getElementById('menu-scroll');
    container.scrollBy({ left: 400, behavior: 'smooth' });
}

// Gallery Modal
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

// ==================== SMART KRĀV AI BARISTA ====================
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
        <div class="flex gap-3">
            <div class="w-8 h-8 bg-black text-white rounded-2xl flex items-center justify-center flex-shrink-0 text-xl">☕</div>
            <div class="bg-white border border-black/10 rounded-3xl rounded-tl-none px-5 py-4 max-w-[85%] text-sm leading-relaxed">
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
        <div class="flex justify-end">
            <div class="bg-black text-white rounded-3xl rounded-tr-none px-5 py-4 max-w-[85%] text-sm leading-relaxed">
                ${text}
            </div>
        </div>`;
    
    container.innerHTML += messageHTML;
    container.scrollTop = container.scrollHeight;
}

// Smart AI Response System (Handles rephrased questions much better)
function getBotResponse(input) {
    const text = input.toLowerCase().trim();

    // Greetings
    if (text.match(/\b(hi|hello|hey|sup|yo|good morning|good afternoon|good evening)\b/)) {
        return "Hello! ☕ Welcome to KRĀV Cafe. How can I assist you today?";
    }

    // Operating Hours (very flexible)
    if (text.includes("hour") || text.includes("open") || text.includes("close") || 
        text.includes("time") || text.includes("schedule") || text.includes("shut") || 
        text.includes("until") || text.includes("when") || text.includes("late")) {
        return "Our operating hours:<br><strong>Monday – Thursday:</strong> 10:00 AM – 10:00 PM<br><strong>Friday – Sunday:</strong> 7:00 AM – 12:00 AM";
    }

    // Menu & Recommendations
    if (text.includes("menu") || text.includes("drink") || text.includes("coffee") || 
        text.includes("recommend") || text.includes("suggest") || text.includes("best") || 
        text.includes("popular") || text.includes("what should") || text.includes("order")) {
        return "Here are our customer favorites:<br>• Signature Pour Over<br>• Black & White Cold Brew<br>• KRĀV Flat White<br>• Oat Milk Latte<br><br>Would you like me to suggest something based on your preference (strong, sweet, milky, or iced)?";
    }

    // Location
    if (text.includes("where") || text.includes("location") || text.includes("address") || 
        text.includes("find") || text.includes("get to") || text.includes("how to reach") || 
        text.includes("direction")) {
        return "We're located at <strong>123 Mabini Avenue, Tanauan City, Batangas</strong>.<br>We also have Drive-Thru service!";
    }

    // WiFi
    if (text.includes("wifi") || text.includes("internet") || text.includes("wi-fi")) {
        return "Yes! We offer free WiFi throughout the entire café.";
    }

    // Parking
    if (text.includes("park") || text.includes("parking")) {
        return "We have 13 dedicated parking spots available.";
    }

    // Seating
    if (text.includes("seat") || text.includes("table") || text.includes("sit") || text.includes("capacity")) {
        return "We have comfortable seating for 77 guests.";
    }

    // Vegan / Milk alternatives
    if (text.includes("vegan") || text.includes("oat") || text.includes("almond") || 
        text.includes("milk") || text.includes("non-dairy") || text.includes("plant")) {
        return "We offer Oat Milk and Almond Milk alternatives. Many of our drinks can be made vegan-friendly!";
    }

    // Default friendly response
    return "Great question! ☕<br>I can help you with our menu, operating hours, location, parking, WiFi, or coffee recommendations.<br>What would you like to know?";
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;

    const msg = input.value.trim();
    if (!msg) return;

    addUserMessage(msg);
    input.value = '';

    // Show thinking delay then smart reply
    setTimeout(() => {
        const reply = getBotResponse(msg);
        addBotMessage(reply);
    }, 650);
}

// Leaflet Map
function initMap() {
    const mapEl = document.getElementById('map-container');
    if (!mapEl) return;

    const map = L.map(mapEl).setView([14.0823, 121.1499], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    L.marker([14.0823, 121.1499]).addTo(map)
        .bindPopup('<b>KRĀV Cafe Tanauan</b><br>123 Mabini Avenue')
        .openPopup();
}

// Initialize everything
window.onload = () => {
    console.log("%c☕ KRĀV Cafe Tanauan - Ready", "color:#111;font-weight:bold");
    initMap();
};