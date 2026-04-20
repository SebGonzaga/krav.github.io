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

// Chatbot
function toggleChat() {
    const win = document.getElementById('chat-window');
    if (win) win.classList.toggle('hidden');
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    if (!input.value.trim()) return;

    const container = document.getElementById('chat-messages');
    container.innerHTML += `
        <div class="flex justify-end">
            <div class="bg-black text-white rounded-3xl px-5 py-3 max-w-[80%]">
                ${input.value}
            </div>
        </div>`;
    container.scrollTop = container.scrollHeight;
    input.value = '';
}

// Leaflet Map
function initMap() {
    const mapEl = document.getElementById('map-container');
    if (!mapEl) return;

    const map = L.map(mapEl).setView([14.0823, 121.1499], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    L.marker([14.0823, 121.1499]).addTo(map)
        .bindPopup('<b>Krav Cafe Tanauan</b><br>123 Mabini Avenue')
        .openPopup();
}

// Initialize everything
window.onload = () => {
    console.log("%c☕ Krav Cafe Tanauan - Ready", "color:#111;font-weight:bold");
    initMap();
};