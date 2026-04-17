// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('hamburger-icon');
    menu.classList.toggle('hidden');
    if (!menu.classList.contains('hidden')) {
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6h12v12"/>`;
    } else {
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
    }
}

// Image Modal
function showImageModal(id) {
    const modal = document.getElementById('image-modal');
    const img = document.getElementById('modal-image');
    const caption = document.getElementById('modal-caption');

    const images = {
        1: { src: "https://picsum.photos/id/1015/1200/900", cap: "Cozy corner at Krav Cafe" },
        2: { src: "https://picsum.photos/id/201/1200/900", cap: "Freshly brewed pour over" },
        3: { src: "https://picsum.photos/id/1005/1200/900", cap: "Minimalist seating" },
        4: { src: "https://picsum.photos/id/133/1200/900", cap: "Fresh pastries daily" }
    };

    img.src = images[id].src;
    caption.textContent = images[id].cap;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function hideImageModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// AI Chatbot
function toggleChat() {
    const win = document.getElementById('chat-window');
    win.classList.toggle('hidden');
}

function addBotMessage(text) {
    const container = document.getElementById('chat-messages');
    container.innerHTML += `
        <div class="flex gap-3">
            <div class="w-8 h-8 bg-black text-white rounded-2xl flex items-center justify-center">☕</div>
            <div class="bg-white border border-black/30 rounded-3xl px-5 py-3">${text}</div>
        </div>`;
    container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    
    const container = document.getElementById('chat-messages');
    container.innerHTML += `<div class="flex justify-end"><div class="bg-black text-white rounded-3xl px-5 py-3">${msg}</div></div>`;
    container.scrollTop = container.scrollHeight;
    input.value = '';

    setTimeout(() => {
        addBotMessage("Thank you! Our team will get back to you soon.");
    }, 800);
}

// Map Initialization
function initMap() {
    const mapEl = document.getElementById('map-container');
    if (!mapEl) return;
    
    const map = L.map(mapEl).setView([14.0823, 121.1499], 16);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    L.marker([14.0823, 121.1499]).addTo(map)
        .bindPopup('<b>Krav Cafe Tanauan</b><br>123 Mabini Avenue, Tanauan City')
        .openPopup();
}

// Initialize everything
window.onload = () => {
    console.log("%c☕ Krav Cafe Tanauan Website Loaded Successfully", "color:#111;font-weight:bold");
    initMap();
    
    // Trigger fade-in animations on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-fade-in').forEach(el => {
        observer.observe(el);
    });
};
// Book Menu Variables
let currentPage = 1;
const totalPages = 5; // Change to 8 if you add more pages

function showPage(page) {
    document.querySelectorAll('.book-page').forEach(p => {
        p.classList.remove('active');
    });
    
    const activePage = document.getElementById(`page${page}`);
    if (activePage) {
        activePage.classList.add('active');
    }
    currentPage = page;
}

function nextPage() {
    if (currentPage < totalPages) {
        showPage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

// Initialize book on load
window.addEventListener('load', () => {
    showPage(1);   // Start with first page
});

// Allow clicking on page to flip forward
document.querySelectorAll('.book-page').forEach(page => {
    page.addEventListener('click', () => {
        if (currentPage < totalPages) {
            nextPage();
        }
    });
});
// Smooth horizontal scroll for menu
function scrollMenuLeft() {
    const container = document.getElementById('menu-scroll');
    container.scrollBy({ left: -400, behavior: 'smooth' });
}

function scrollMenuRight() {
    const container = document.getElementById('menu-scroll');
    container.scrollBy({ left: 400, behavior: 'smooth' });
}