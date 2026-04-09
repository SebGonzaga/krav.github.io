/**
 * KRĀV CAFE - CORE JAVASCRIPT
 * Features: Menu, Cart, Chatbot, Theme Toggle
 */

// 1. DATA STATE
let cart = [];

const menuItems = [
  { id: 1, category: "signature", name: "Dark Chocolate Spiced Mocha", price: "₱189", desc: "Rich Valrhona chocolate with warming spices and bold espresso", img: "https://images.unsplash.com/photo-1559925394-6e3e9c3f8b7a", featured: true },
  { id: 2, category: "espresso", name: "Signature Flat White", price: "₱165", desc: "Silky microfoam over single-origin espresso", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd6e2f" },
  { id: 3, category: "noncoffee", name: "Ube Cheese Vanilla Frappe", price: "₱179", desc: "Creamy ube with cheese notes and vanilla bean", img: "https://images.unsplash.com/photo-1541807084-0d2f9c5c5e4b" },
  { id: 4, category: "kitchen", name: "Tapsilog with Local Sukang", price: "₱245", desc: "Tender beef tapa, garlic rice & sunny-side egg", img: "https://images.unsplash.com/photo-1567620905732-2d1ec7a2c0c0", featured: true },
  { id: 5, category: "signature", name: "Klepon Pandan Mochi Drink", price: "₱169", desc: "Coconut pandan milk with chewy mochi", img: "https://images.unsplash.com/photo-1511920170033-f8396924c348" },
  { id: 6, category: "espresso", name: "Cafe Mocha Madness", price: "₱175", desc: "Belgian chocolate, espresso & toasted marshmallow", img: "https://images.unsplash.com/photo-1551218808-94e220e084d2" },
  { id: 7, category: "noncoffee", name: "Biscoff Lotus Milkshake", price: "₱159", desc: "Crushed Biscoff cookies blended smooth", img: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd" },
  { id: 8, category: "kitchen", name: "Truffle Mushroom Pasta", price: "₱295", desc: "Tagliatelle in creamy truffle sauce", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9" },
  { id: 9, category: "signature", name: "Oreo Kunafa Frappe", price: "₱189", desc: "Kunafa pastry blended with Oreo cookies", img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5" },
  { id: 10, category: "espresso", name: "Espresso Tonic", price: "₱155", desc: "Bright espresso over tonic water & lime", img: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13" },
  { id: 11, category: "noncoffee", name: "Strawberry Matcha Latte", price: "₱169", desc: "Fresh strawberries layered with ceremonial matcha", img: "https://images.unsplash.com/photo-1558317374-067fb5f3003d" },
  { id: 12, category: "kitchen", name: "All-Day Breakfast Sandwich", price: "₱225", desc: "Sourdough, bacon, eggs, cheddar & aioli", img: "https://images.unsplash.com/photo-1521017432531-3483e6c3e8d2" }
];

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1559925394-6e3e9c3f8b7a", label: "#IndustrialChic" },
  { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd6e2f", label: "#ArtisanPour" },
  { src: "https://images.unsplash.com/photo-1567620905732-2d1ec7a2c0c0", label: "#ComfortFood" },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", label: "#CommunityHub" }
];

// ================== MENU FUNCTIONS ==================
function renderMenu(items) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  grid.innerHTML = '';

  items.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = `menu-card ${item.featured ? 'featured' : ''}`;
    card.style.animationDelay = `${i * 60}ms`;
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" loading="lazy">
      <div class="menu-info">
        <h3>${item.name}</h3>
        <p style="color:#aaa; margin:10px 0;">${item.desc}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
          <span class="price">${item.price}</span>
          <div>
            <button onclick="showModal(${item.id})" class="btn" style="padding:8px 18px; font-size:0.95rem; margin-right:8px;">Details</button>
            <button onclick="addToCartById(${item.id})" class="btn" style="padding:8px 18px; font-size:0.95rem; background:#3a3a3a; color:var(--gold);">Add</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  setTimeout(() => {
    document.querySelectorAll('.menu-card').forEach(c => c.classList.add('visible'));
  }, 100);
}

function filterCategory(cat, event) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (event) event.currentTarget.classList.add('active');

  const filtered = cat === 'all' ? menuItems : menuItems.filter(i => i.category === cat);
  renderMenu(filtered);
}

function filterMenu() {
  const term = document.getElementById('searchInput').value.toLowerCase();
  const filtered = menuItems.filter(item => 
    item.name.toLowerCase().includes(term) || item.desc.toLowerCase().includes(term)
  );
  renderMenu(filtered);
}

// ================== CART LOGIC ==================
function addToCartById(id) {
  const item = menuItems.find(i => i.id === id);
  if (item) addToCart(item);
}

function addToCart(item) {
  const existing = cart.find(cartItem => cartItem.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  updateCartUI();
  showToast(`${item.name} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

function changeQuantity(id, change) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = Math.max(1, item.quantity + change);
    updateCartUI();
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  document.getElementById('cartCount').textContent = totalItems;
  const drawerCount = document.getElementById('drawerCartCount');
  if (drawerCount) drawerCount.textContent = totalItems;

  const itemsContainer = document.getElementById('cartItems');
  if (!itemsContainer) return;
  itemsContainer.innerHTML = '';
  
  let totalPrice = 0;

  cart.forEach(item => {
    const priceNum = parseInt(item.price.replace('₱', '')) || 0;
    totalPrice += priceNum * (item.quantity || 1);

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div style="flex:1">
        <h4 style="color:var(--gold)">${item.name}</h4>
        <p style="color:#aaa">${item.price} × ${item.quantity}</p>
        <div style="display:flex; gap:12px; margin-top:8px;">
          <button onclick="changeQuantity(${item.id}, -1)" class="qty-btn">–</button>
          <span style="padding:4px 10px;">${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, 1)" class="qty-btn">+</button>
          <button onclick="removeFromCart(${item.id})" style="margin-left:auto; color:#ff6666; background:none; border:none; cursor:pointer;">Remove</button>
        </div>
      </div>
    `;
    itemsContainer.appendChild(div);
  });

  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = `₱${totalPrice}`;
}

// ================== MODAL & HELPERS ==================
function showModal(id) {
  const item = menuItems.find(i => i.id === id);
  if (!item) return;

  document.getElementById('modalImage').src = item.img;
  document.getElementById('modalName').textContent = item.name;
  document.getElementById('modalDesc').textContent = item.desc;
  document.getElementById('modalPrice').innerHTML = `<strong>${item.price}</strong>`;

  document.getElementById('modalAddBtn').onclick = () => {
    addToCart(item);
    closeModal();
  };

  document.getElementById('menuModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('menuModal').style.display = 'none';
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
}

function checkout() {
  if (cart.length === 0) return alert("Your cart is empty!");
  alert("Thank you for your order! (Demo)");
  cart = [];
  updateCartUI();
  toggleCart();
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// ================== CHATBOT ==================
function toggleChat() {
  const chat = document.getElementById('chatbot');
  if (!chat) return;

  const isOpening = chat.style.display !== 'flex';
  chat.style.display = isOpening ? 'flex' : 'none';

  if (isOpening && document.getElementById('chatBody').children.length === 0) {
    setTimeout(() => addBotMessage("Hi there! I'm Krāv AI. Ready to find your new favorite drink? ☕"), 600);
  }
}

function addBotMessage(text) {
  const body = document.getElementById('chatBody');
  const msg = document.createElement('div');
  msg.className = 'chat-message bot';
  msg.textContent = text;
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const body = document.getElementById('chatBody');
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user';
  userMsg.textContent = text;
  body.appendChild(userMsg);
  
  input.value = '';
  body.scrollTop = body.scrollHeight;

  setTimeout(() => {
    let reply = "That sounds delicious! Should I add that to your cart?";
    const lower = text.toLowerCase();
    if (lower.includes("coffee")) reply = "Our Dark Chocolate Spiced Mocha is a fan favorite!";
    if (lower.includes("breakfast") || lower.includes("eat")) reply = "Try our Tapsilog or Truffle Pasta!";
    addBotMessage(reply);
  }, 800);
}

// ================== THEME TOGGLE (Fixed) ==================
// Theme Toggle
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    if (document.body.classList.contains('light-mode')) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'light');
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'dark');
    }
  });
}

// Call this in window.onload
window.onload = () => {
  // ... your existing code ...
  initTheme();   // ← Add this line
};

// ================== INITIALIZATION ==================
window.onload = () => {
  renderMenu(menuItems);

  // Render Gallery
  const galleryContainer = document.getElementById('galleryContainer');
  if (galleryContainer) {
    galleryImages.forEach(item => {
      const card = document.createElement('div');
      card.className = 'vibe-card';
      card.innerHTML = `
        <img src="${item.src}" alt="${item.label}" loading="lazy">
        <div class="vibe-overlay"><h3>${item.label}</h3></div>
      `;
      galleryContainer.appendChild(card);
    });
  }

  // Event Listeners
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', toggleCart);

  const modal = document.getElementById('menuModal');
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target.id === 'menuModal') closeModal();
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert("Message received! We'll get back to you soon.");
      e.target.reset();
    });
  }

  // Initialize Theme Toggle
  initTheme();

  // Show floating chat button only on desktop
  if (window.innerWidth > 768) {
    const chatFloat = document.getElementById('chatBtn');
    if (chatFloat) chatFloat.style.display = 'block';
  }
};