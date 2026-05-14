const API_BASE = 'https://your-api.com';
const MAX_STOCK = 15;

// === FIREBASE CONFIGURATION ===
// IMPORTANT: Replace this with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHWbXlT496Kp8Wwti-VTs4d2vxGb8qGFk",
  authDomain: "flexfabric-college-project.firebaseapp.com",
  projectId: "flexfabric-college-project",
  storageBucket: "flexfabric-college-project.firebasestorage.app",
  messagingSenderId: "281839690968",
  appId: "1:281839690968:web:74e78b5ecab2167252e3ad",
  measurementId: "G-JRC07RM7SM"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

const PRODUCTS = [
  {id:1, name:'Tec Green Baggy', cat:'jeans', price:1499, oldPrice:null, image:'https://blurgvillage.com/cdn/shop/files/WEBP_File_1609_e7d865e5-b9ff-4267-a37c-1989bd800b7a.webp?v=1773900966', badge:'new', desc:'A perfect blend of street style and comfort, featuring a relaxed oversized fit with a unique faded green wash.', sizes:['28','30','32','34','36','38'], rating:4.8, reviews:234},
  {id:2, name:'Hex Green Straight fit', cat:'jeans', price:1299, oldPrice:2499, image:'https://blurgvillage.com/cdn/shop/files/WEBP_File_1450_d36fce3d-4522-4a73-9be2-7a3648a0954b.webp?v=1773918886', badge:'sale', desc:'Hex Green Straight Fit Jeans – Clean straight-cut design with a subtle faded wash.', sizes:['28','30','32','34','36'], rating:4.6, reviews:189},
  {id:3, name:'Bluby Bootcut', cat:'jeans', price:1249, oldPrice:null, image:'https://blurgvillage.com/cdn/shop/files/WEBP_File_2158.webp?v=1775556808', badge:'new', desc:'Classic bootcut fit with a faded blue wash, giving a vintage vibe while keeping your style effortlessly modern.', sizes:['30','32','34','36','38'], rating:4.7, reviews:142},
  {id:4, name:'Drove Pattern Dark Baggy', cat:'jeans', price:1399, oldPrice:null, image:'https://blurgvillage.com/cdn/shop/files/JPG_File_1652-scaled.jpg?v=1772444522', badge:null, desc:'Bold dark-wash baggy fit with unique pattern detailing, giving a standout streetwear edge with maximum comfort.', sizes:['28','30','32','34','36'], rating:4.5, reviews:312},
  {id:5, name:'Luxor Brown wide', cat:'jeans', price:1149, oldPrice:2499, image:'https://blurgvillage.com/cdn/shop/files/WEBP_File_071-scaled.webp?v=1772444664', badge:'sale', desc:'Rich brown tone with a relaxed baggy fit, blending earthy aesthetics with modern streetwear comfort.', sizes:['28','30','32','34','36'], rating:4.9, reviews:87},
  {id:6, name:'Buransh Red Sneaker', cat:'shoes', price:6999, oldPrice:8999, image:'https://gullylabs.com/cdn/shop/files/DSC09477_3.jpg?v=1773745830&width=950', badge:'sale', desc:'Premium fabric and strong stitching meet bold Indian red aesthetics.', sizes:['7','8','9','10','11','12'], rating:4.8, reviews:421},
  {id:7, name:'Saaj Orange Sneaker', cat:'shoes', price:6799, oldPrice:null, image:'https://gullylabs.com/cdn/shop/files/2-amazon.jpg?v=1773749450&width=2080', badge:'new', desc:'Designed for standout moments, these sneakers blend vibrant orange with luxe-quality materials.', sizes:['7','8','9','10','11'], rating:4.7, reviews:193},
  {id:8, name:'Baaz Falak Blue Sneaker', cat:'shoes', price:5799, oldPrice:null, image:'https://gullylabs.com/cdn/shop/files/DSC09951_1.jpg?v=1773817545&width=2080', badge:null, desc:'A statement sneaker inspired by the night sky, built with premium materials for occasions.', sizes:['7','8','9','10','11','12'], rating:4.4, reviews:276},
  {id:9, name:'Turf Olive Sneaker', cat:'shoes', price:7299, oldPrice:null, image:'https://gullylabs.com/cdn/shop/files/DSC04078.jpg?v=1773476879&width=2080', badge:'new', desc:'Turf olive sneakers reflect understated luxury with rich color and fine detailing.', sizes:['7','8','9','10','11','12'], rating:4.9, reviews:156},
  {id:10, name:'1948 Victory Blue', cat:'shoes', price:8499, oldPrice:9999, image:'https://gullylabs.com/cdn/shop/files/DSC00009_6c4f5a7a-3c0b-402e-ae91-dadfed96da07.jpg?v=1773750771&width=2080', badge:'sale', desc:'A powerful blue tone with premium fabric, built to represent style and victory.', sizes:['7','8','9','10','11','12'], rating:4.8, reviews:98},
  {id:11, name:'Blue Woven Micro-Checked', cat:'shirts', price:2599, oldPrice:null, image:'https://static.zara.net/assets/public/182a/d1df/0392485684a2/ec88e73db860/04302310500-e1/04302310500-e1.jpg?ts=1773310575141&w=1482', badge:null, desc:'100% two-ply cotton Oxford cloth. Button-down collar with box pleat at back. Slim fit.', sizes:['S','M','L','XL','XXL'], rating:4.6, reviews:318},
  {id:12, name:'Linen Summer Shirt', cat:'shirts', price:2799, oldPrice:3499, image:'https://www.urbanmonkey.com/cdn/shop/files/1_a8c4029c-b806-4db9-97c2-a2e5b1eaca33.png?v=1773639955', badge:'sale', desc:'100% Belgian linen. Relaxed camp collar. Garment-washed for a soft, worn-in feel.', sizes:['S','M','L','XL'], rating:4.7, reviews:245},
  {id:13, name:'Flannel Check Overshirt', cat:'shirts', price:3299, oldPrice:null, image:'https://www.urbanmonkey.com/cdn/shop/files/Web_res_for_website_2026_9b0dc0fc-0425-4859-a466-f7b2ac39bdbd.png?v=1775030572', badge:'new', desc:'Heavy brushed flannel in a classic oversized tartan. Can be worn open as a light jacket.', sizes:['S','M','L','XL','XXL'], rating:4.5, reviews:127},
  {id:14, name:'Tech Shirt LS', cat:'shirts', price:1999, oldPrice:null, image:'https://www.urbanmonkey.com/cdn/shop/files/Check_Corduroy_Shirt_13_white_green_01.jpg?v=1763015294', badge:null, desc:'Moisture-wicking stretch fabric. Four-way stretch. Wrinkle-resistant for travel.', sizes:['S','M','L','XL','XXL'], rating:4.3, reviews:188},
  {id:15, name:'Cuban Collar Silk Blend', cat:'shirts', price:3799, oldPrice:null, image:'https://thebearhouse.com/cdn/shop/files/7_1_e39f6f52-9aba-46f2-9e74-6b0dd3542b95.jpg?v=1776515686&width=1080', badge:'new', desc:'Viscose silk blend with a smooth, fluid drape. Open revere collar. All-over floral jacquard pattern.', sizes:['S','M','L','XL'], rating:4.8, reviews:93},
  {id:16, name:'Heavyweight Flesx Tee', cat:'tees', price:1299, oldPrice:null, image:'https://thesagacity.in/cdn/shop/files/edit-16a.jpg?v=1749157276&width=900', badge:null, desc:'240gsm 100% ringspun combed cotton. Boxy fit with dropped shoulders. The perfect basic.', sizes:['XS','S','M','L','XL','XXL'], rating:4.9, reviews:567},
  {id:17, name:'Graphic Tee — Skyline', cat:'tees', price:1599, oldPrice:1999, image:'https://thesagacity.in/cdn/shop/files/edit-53.jpg?v=1749153678&width=600', badge:'sale', desc:'Limited edition cityscape graphic in water-based ink. Washed for a vintage feel.', sizes:['XS','S','M','L','XL','XXL'], rating:4.7, reviews:234},
  {id:18, name:'Acid Wash Crop Tee', cat:'tees', price:1499, oldPrice:null, image:'https://thesagacity.in/cdn/shop/files/edit-18_44c27a2c-0fb8-4fdd-b332-c9fedd059005.jpg?v=1766256576&width=900', badge:'new', desc:'Boxy crop silhouette with raw hem. Unique acid-wash — every piece is one of a kind.', sizes:['XS','S','M','L','XL'], rating:4.5, reviews:156},
  {id:19, name:'Long Sleeve Pocket Tee', cat:'tees', price:1199, oldPrice:null, image:'https://static.zara.net/assets/public/2bb3/1860/253e498998b1/6ce068b2e46a/06224599407-e1/06224599407-e1.jpg?ts=1772534453106&w=750', badge:null, desc:'Classic ribbed long-sleeve with chest patch pocket. Lightweight 180gsm jersey.', sizes:['XS','S','M','L','XL','XXL'], rating:4.4, reviews:198},
  {id:20, name:'Technical Mesh Tee', cat:'tees', price:1799, oldPrice:null, image:'https://static.zara.net/assets/public/4a08/413f/a9e643fd8375/711b626e6934/00495451600-e1/00495451600-e1.jpg?ts=1775743402958&w=1482', badge:'new', desc:'Engineered perforated mesh for max breathability. Quick-dry moisture wicking.', sizes:['S','M','L','XL','XXL'], rating:4.6, reviews:142},
  {id:21, name:'Flesx Leather Wallet', cat:'accessories', price:1499, oldPrice:null, image:'https://blurgvillage.com/cdn/shop/files/WEBP_File_1857.webp?v=1774358661&width=720', badge:null, desc:'Full-grain vegetable tanned leather. 6 card slots, RFID blocking. Gets better with age.', sizes:['One Size'], rating:4.8, reviews:312},
  {id:22, name:'Logo Cap — Structured', cat:'accessories', price:999, oldPrice:1299, image:'https://blurgvillage.com/cdn/shop/files/WEBP_File_1778.webp?v=1774350094&width=720', badge:'sale', desc:'6-panel structured cap in heavy twill. Embroidered Flesx logo. Adjustable snapback.', sizes:['One Size'], rating:4.6, reviews:421},
  {id:23, name:'Minimal Beanie', cat:'accessories', price:799, oldPrice:null, image:'https://in.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-key-pouch--N00188_PM2_Front%20view.png?wid=1090&hei=1090', badge:null, desc:'100% merino wool. Fine rib knit. Naturally odour-resistant and temperature-regulating.', sizes:['One Size'], rating:4.7, reviews:234},
  {id:24, name:'Canvas Tote XL', cat:'accessories', price:1199, oldPrice:null, image:'https://cdn-s3.touchofmodern.com/products/001/937/184/927d11cf37bf8fbb88bf8bbbfe73210a_large.jpg?1597794727', badge:'new', desc:'Heavy 16oz natural canvas. Reinforced handles. Interior zip pocket. Fits 15" laptop.', sizes:['One Size'], rating:4.5, reviews:187},
  {id:25, name:'Sport Socks 3-Pack', cat:'accessories', price:599, oldPrice:799, image:'https://www.urbanmonkey.com/cdn/shop/files/Fresh_0ff_white_baseball_dad_cap_02.jpg?v=1772606967&width=800', badge:'sale', desc:'Cushioned arch support. 75% combed cotton. Anti-odour. Crew length. 3 pairs included.', sizes:['S/M','M/L','L/XL'], rating:4.8, reviews:678},
];

const stockMap = {};
PRODUCTS.forEach(p => { stockMap[p.id] = MAX_STOCK; });

/* ── APP STATE ── */
let currentUser = null;
let authCallback = null;
let cart = JSON.parse(localStorage.getItem('flesx_cart')) || [];
let wishlist = new Set();
let currentProduct = null;
let selectedSize = null;
let selectedPaymentMethod = 'card';
let couponApplied = false;

/* ══════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════ */
function openAuth(tab = 'signin', callback = null) {
  authCallback = callback;
  switchAuthTab(tab);
  document.getElementById('authModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const f = document.getElementById(tab === 'signin' ? 'signinEmail' : 'signupFirst');
    if (f) f.focus();
  }, 300);
}
function closeAuth() {
  document.getElementById('authModal').classList.remove('open');
  document.body.style.overflow = '';
}
function switchAuthTab(tab) {
  document.getElementById('tabSignin').classList.toggle('active', tab === 'signin');
  document.getElementById('tabSignup').classList.toggle('active', tab === 'signup');
  document.getElementById('panelSignin').classList.toggle('active', tab === 'signin');
  document.getElementById('panelSignup').classList.toggle('active', tab === 'signup');
  document.getElementById('authModalTitle').textContent = tab === 'signin' ? 'Welcome Back' : 'Create Account';
}
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
}
function checkPwStrength(val) {
  const bars = [document.getElementById('ps1'), document.getElementById('ps2'), document.getElementById('ps3'), document.getElementById('ps4')];
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const colors = ['#ff3d00','#ff8800','#ffd600','#00e676'];
  bars.forEach((b, i) => { b.style.background = i < score ? colors[score - 1] : 'var(--border)'; });
}
function showAuthError(panel, msg) {
  const el = document.getElementById(panel + 'Error');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 4000);
}
async function doSignin() {
  const email = document.getElementById('signinEmail').value.trim();
  const password = document.getElementById('signinPassword').value;
  if (!email || !password) { showAuthError('signin', 'Please fill in all fields.'); return; }
  const btn = document.getElementById('signinBtn');
  btn.textContent = 'Signing in...'; btn.disabled = true;
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
    closeAuth();
    showToast(`👋 Welcome back!`);
    if (authCallback) { authCallback(); authCallback = null; }
  } catch (error) {
    showAuthError('signin', error.message);
  }
  btn.textContent = 'Sign In →'; btn.disabled = false;
}

async function doSignup() {
  const firstName = document.getElementById('signupFirst').value.trim();
  const lastName = document.getElementById('signupLast').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const terms = document.getElementById('signupTerms').checked;
  if (!firstName || !email || !password) { showAuthError('signup', 'Please fill in all required fields.'); return; }
  if (password.length < 8) { showAuthError('signup', 'Password must be at least 8 characters.'); return; }
  if (password !== confirm) { showAuthError('signup', 'Passwords do not match.'); return; }
  if (!terms) { showAuthError('signup', 'Please accept the Terms of Service.'); return; }
  
  const btn = document.getElementById('signupBtn');
  btn.textContent = 'Creating account...'; btn.disabled = true;
  
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({
      displayName: `${firstName} ${lastName}`.trim()
    });
    closeAuth();
    showToast(`🎉 Account created! Welcome!`);
    if (authCallback) { authCallback(); authCallback = null; }
  } catch (error) {
    showAuthError('signup', error.message);
  }
  btn.textContent = 'Create Account →'; btn.disabled = false;
}

async function doSocialAuth(provider) {
  showToast(`⏳ ${provider} auth coming soon — use email for now`);
}

// Auth State Listener
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = { 
      id: user.uid, 
      email: user.email, 
      firstName: user.displayName ? user.displayName.split(' ')[0] : 'User', 
      lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '' 
    };
  } else {
    currentUser = null;
  }
  renderNavUser();
});

async function signOut() {
  await auth.signOut();
  showToast('👋 Signed out. See you soon!');
  if(window.location.pathname.includes('checkout.html')) {
    window.location.href = 'index.html';
  }
}
function renderNavUser() {
  const el = document.getElementById('navUser');
  if (currentUser) {
    const initials = (currentUser.firstName[0] + (currentUser.lastName?.[0] || '')).toUpperCase() || 'U';
    el.innerHTML = `<div style="display:flex;align-items:center;gap:8px;cursor:pointer" onclick="openAccount()">
      <div class="user-avatar">${initials}</div>
      <div style="display:flex;flex-direction:column;align-items:flex-start">
        <span style="font-size:12px;font-weight:700;color:var(--text)">${currentUser.firstName}</span>
        <span style="font-size:10px;color:var(--text3)">Account</span>
      </div>
    </div>`;
  } else {
    el.innerHTML = `<button class="user-btn" onclick="openAuth('signin')" id="signInNavBtn">Sign In</button>`;
  }
}
function requireAuth(callback) {
  if (currentUser) { callback(); return; }
  openAuth('signin', callback);
}

/* ══════════════════════════════════════════════════
   STOCK HELPERS
══════════════════════════════════════════════════ */
function getStock(productId) { return stockMap[productId] ?? MAX_STOCK; }
function deductStock(productId, qty = 1) {
  if (stockMap[productId] !== undefined) stockMap[productId] = Math.max(0, stockMap[productId] - qty);
}
function restoreStock(productId, qty = 1) {
  if (stockMap[productId] !== undefined) stockMap[productId] = Math.min(MAX_STOCK, stockMap[productId] + qty);
}
function stockLabel(stock) {
  if (stock <= 0) return { cls: 'out-stock', icon: '🔴', text: 'Out of Stock' };
  if (stock <= 3) return { cls: 'low-stock', icon: '🟡', text: `Only ${stock} left!` };
  return { cls: 'in-stock', icon: '🟢', text: `${stock} in stock` };
}
function stockBarColor(stock) {
  const pct = stock / MAX_STOCK;
  if (pct <= 0) return '#333';
  if (pct <= 0.2) return '#ff3d00';
  if (pct <= 0.5) return '#ffa500';
  return '#00e676';
}

/* ══════════════════════════════════════════════════
   PRODUCT RENDERING
══════════════════════════════════════════════════ */
const IMG_PH = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="opacity:.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`;

function productImgHTML(p) {
  const imgTag = p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : '';
  const phStyle = p.image ? 'display:none' : '';
  return `<div class="product-img-wrap">
    ${imgTag}
    <div class="product-img-placeholder" style="${phStyle}">${IMG_PH}<span style="font-size:10px">${p.image ? 'Image missing' : 'No image'}</span></div>
  </div>`;
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  const label = document.getElementById('productCountLabel');
  label.textContent = `Showing ${products.length} of ${PRODUCTS.length} items`;
  if (!products.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text2)"><div style="font-size:48px;margin-bottom:16px">🔍</div><p style="font-size:16px">No products found.</p></div>`;
    return;
  }
  grid.innerHTML = products.map((p, i) => {
    const stock = getStock(p.id);
    const oos = stock <= 0;
    const isWished = wishlist.has(p.id);
    const pct = Math.round((stock / MAX_STOCK) * 100);
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    let badgeHTML = '';
    if (oos) badgeHTML = '<div class="badge-oos">OUT OF STOCK</div>';
    else if (p.badge === 'new') badgeHTML = '<div class="badge-new">NEW</div>';
    else if (p.badge === 'sale') badgeHTML = '<div class="badge-sale">SALE</div>';
    return `<div class="product-card${oos ? ' out-of-stock' : ''}" style="animation-delay:${i*.04}s" onclick="openProductById(${p.id})">
      ${badgeHTML}
      <div style="position:relative">
        ${productImgHTML(p)}
        ${oos ? `<div class="oos-overlay"><div class="oos-label">Out of Stock</div></div>` : ''}
        ${!oos ? `<div class="product-actions">
          <button class="btn-cart" onclick="event.stopPropagation();quickAddToCart(${p.id})">+ Select Size</button>
          <button class="btn-wish${isWished ? ' wishlisted' : ''}" onclick="event.stopPropagation();toggleWishlist(${p.id})">${isWished ? '♥' : '♡'}</button>
        </div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">
          <span class="price-main">₹${p.price.toLocaleString()}</span>
          ${p.oldPrice ? `<span class="price-old">₹${p.oldPrice.toLocaleString()}</span><span class="price-off">${discount}% OFF</span>` : ''}
        </div>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="stock-bar-wrap">
          <div class="stock-bar-label">
            <span>${oos ? 'Out of stock' : stock <= 3 ? `Only ${stock} left!` : `${stock} available`}</span>
            <span>${pct}%</span>
          </div>
          <div class="stock-bar"><div class="stock-bar-fill" style="width:${pct}%;background:${stockBarColor(stock)}"></div></div>
        </div>
      </div>
    </div>`;
  }).join('');
}

/*
  quickAddToCart — called from the product card hover button.
  If user is not signed in → open auth first, then open the product
  modal so they can pick a size. If already signed in → open modal directly.
  The modal's "Add to Cart" button handles the actual add.
*/
function quickAddToCart(productId) {
  requireAuth(() => {
    openProductById(productId);
  });
}

function filterProducts(filter, btnEl) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  let filtered = PRODUCTS;
  if (filter === 'new') filtered = PRODUCTS.filter(p => p.badge === 'new');
  else if (filter === 'sale') filtered = PRODUCTS.filter(p => p.badge === 'sale');
  else if (filter !== 'all') filtered = PRODUCTS.filter(p => p.cat === filter);
  renderProducts(filtered);
}

function handleSearch(q) {
  const query = q.toLowerCase().trim();
  if (!query) { renderProducts(PRODUCTS); return; }
  renderProducts(PRODUCTS.filter(p => p.name.toLowerCase().includes(query) || p.cat.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)));
}

function executeSearch() {
  const input = document.getElementById('searchInput');
  if (input) {
    handleSearch(input.value);
    const catalog = document.getElementById('catalog');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ══════════════════════════════════════════════════
   PRODUCT MODAL
══════════════════════════════════════════════════ */
function openProductById(id) {
  currentProduct = PRODUCTS.find(p => p.id === id);
  if (!currentProduct) return;
  selectedSize = null; // Reset — force explicit selection
  const p = currentProduct;
  const stock = getStock(p.id);
  const oos = stock <= 0;
  const sl = stockLabel(stock);

  document.getElementById('modalProductName').textContent = p.name;
  document.getElementById('modalProductName2').textContent = p.name;
  document.getElementById('modalProductCat').textContent = p.cat.toUpperCase();
  document.getElementById('modalProductDesc').textContent = p.desc;
  document.getElementById('modalProductStars').textContent = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
  document.getElementById('modalProductReviews').textContent = `(${p.reviews} reviews)`;
  document.getElementById('modalProductPrice').innerHTML = `₹${p.price.toLocaleString()}${p.oldPrice ? ` <span style="font-size:18px;text-decoration:line-through;color:var(--text3)">₹${p.oldPrice.toLocaleString()}</span>` : ''}`;
  document.getElementById('modalStockInfo').innerHTML = `<div class="modal-stock-info ${sl.cls}">${sl.icon} ${sl.text}</div>`;

  const img = document.getElementById('modalProductImg');
  const ph = document.getElementById('modalProductImgPh');
  if (p.image) { img.src = p.image; img.alt = p.name; img.style.display = 'block'; ph.style.display = 'none'; img.onerror = () => { img.style.display='none'; ph.style.display='flex'; }; }
  else { img.style.display = 'none'; ph.style.display = 'flex'; }

  // Render sizes — none pre-selected
  document.getElementById('modalSizes').innerHTML = p.sizes.map(s =>
    `<button class="size-btn" onclick="selectSize(this,'${s}')">${s}</button>`
  ).join('');

  // Hide the size hint on fresh open
  document.getElementById('sizeRequiredHint').classList.remove('show');

  const addBtn = document.getElementById('modalAddCartBtn');
  const wishBtn = document.getElementById('modalWishBtn');
  if (oos) { addBtn.textContent = 'Out of Stock'; addBtn.disabled = true; addBtn.style.opacity = '.5'; }
  else { addBtn.textContent = 'Add to Cart'; addBtn.disabled = false; addBtn.style.opacity = '1'; }
  wishBtn.textContent = wishlist.has(p.id) ? '♥' : '♡';
  wishBtn.style.color = wishlist.has(p.id) ? 'var(--accent2)' : '';

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  if (!document.getElementById('checkoutModal').classList.contains('open')) document.body.style.overflow = '';
}
function selectSize(el, size) {
  selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  // Hide hint once a size is selected
  document.getElementById('sizeRequiredHint').classList.remove('show');
}
function addToCartFromModal() {
  // Size is required — show hint if not picked yet
  if (!selectedSize) {
    const hint = document.getElementById('sizeRequiredHint');
    hint.classList.remove('show');
    // Force reflow so the shake animation re-triggers each time
    void hint.offsetWidth;
    hint.classList.add('show');
    // Briefly highlight the size buttons
    document.querySelectorAll('.size-btn').forEach(b => {
      b.style.borderColor = 'var(--accent2)';
      setTimeout(() => { b.style.borderColor = ''; }, 1000);
    });
    return;
  }
  requireAuth(() => {
    addToCart(currentProduct.id, selectedSize);
    closeProductModal();
  });
}
function toggleWishFromModal() {
  requireAuth(() => {
    toggleWishlist(currentProduct.id);
    const wishBtn = document.getElementById('modalWishBtn');
    wishBtn.textContent = wishlist.has(currentProduct.id) ? '♥' : '♡';
    wishBtn.style.color = wishlist.has(currentProduct.id) ? 'var(--accent2)' : '';
  });
}

/* ══════════════════════════════════════════════════
   WISHLIST
══════════════════════════════════════════════════ */
function toggleWishlist(productId) {
  requireAuth(() => {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    if (wishlist.has(productId)) {
      wishlist.delete(productId);
      showToast(`💔 Removed from wishlist`);
    } else {
      wishlist.add(productId);
      showToast(`❤️ ${p.name} added to wishlist`);
    }
    updateWishUI();
    renderProducts(getCurrentFilter());
  });
}
function getCurrentFilter() {
  const activeBtn = document.querySelector('.filter-btn.active');
  if (!activeBtn) return PRODUCTS;
  const txt = activeBtn.textContent.toLowerCase().replace(' 🔥', '');
  if (txt === 'all') return PRODUCTS;
  if (txt === 'new arrivals') return PRODUCTS.filter(p => p.badge === 'new');
  if (txt === 'sale') return PRODUCTS.filter(p => p.badge === 'sale');
  return PRODUCTS.filter(p => p.cat === txt);
}
function updateWishUI() {
  const count = wishlist.size;
  const badge = document.getElementById('wishCount');
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
  document.getElementById('wishItemsCount').textContent = count;

  const list = document.getElementById('wishItemsList');
  const foot = document.getElementById('wishFoot');
  if (count === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">♡</div><p>Your wishlist is empty.<br>Save items you love!</p></div>`;
    foot.style.display = 'none';
    return;
  }
  const items = Array.from(wishlist).map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  list.innerHTML = items.map(p => {
    const s = getStock(p.id);
    const oos = s <= 0;
    return `<div class="wish-item">
      <div class="wish-item-img">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--text3)">${p.name[0]}</div>`}
      </div>
      <div class="wish-item-info">
        <div class="wish-item-name">${p.name}</div>
        <div class="wish-item-price">₹${p.price.toLocaleString()}</div>
        ${oos ? `<div class="wish-item-oos">Out of stock</div>` : s <= 3 ? `<div class="wish-item-oos" style="color:#ffa500">Only ${s} left!</div>` : ''}
      </div>
      <div class="wish-actions">
        <button class="wish-add-btn" onclick="addToCartFromWish(${p.id})" ${oos ? 'disabled' : ''}>${oos ? 'OOS' : '+ Cart'}</button>
        <button class="wish-remove-btn" onclick="toggleWishlist(${p.id})" title="Remove">✕</button>
      </div>
    </div>`;
  }).join('');
  foot.style.display = 'block';
}
// From wishlist sidebar: open product modal so user picks a size
function addToCartFromWish(productId) {
  closeWishlist();
  openProductById(productId);
}
function addAllWishToCart() {
  // Open the first in-stock wish item's modal for size selection
  const inStock = Array.from(wishlist).filter(id => getStock(id) > 0);
  if (!inStock.length) { showToast('❌ No items in stock'); return; }
  closeWishlist();
  openProductById(inStock[0]);
  if (inStock.length > 1) showToast(`👆 Select a size — you have ${inStock.length} wish items to add`);
}
function openWishlist() {
  requireAuth(() => {
    updateWishUI();
    document.getElementById('wishOverlay').classList.add('open');
    document.getElementById('wishSidebar').classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}
function closeWishlist() {
  document.getElementById('wishOverlay').classList.remove('open');
  document.getElementById('wishSidebar').classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════
   CART
══════════════════════════════════════════════════ */
function saveCart() {
  localStorage.setItem('flesx_cart', JSON.stringify(cart));
}

function addToCart(productId, size) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const stock = getStock(productId);
  if (stock <= 0) { showToast('❌ Out of stock'); return; }
  const existing = cart.find(i => i.id === productId && i.size === size);
  const currentQty = existing ? existing.qty : 0;
  if (currentQty >= stock) {
    showToast(`⚠️ Only ${stock} units available`);
    return;
  }
  if (existing) existing.qty++;
  else cart.push({ ...product, size, qty: 1 });
  saveCart();
  updateCartUI();
  showToast(`✓ ${product.name} (${size}) added to cart`);
}
function removeFromCart(idx) {
  cart.splice(idx, 1);
  saveCart();
  updateCartUI();
}
function changeQty(idx, delta) {
  const item = cart[idx];
  const stock = getStock(item.id);
  const newQty = item.qty + delta;
  if (newQty < 1) { removeFromCart(idx); return; }
  if (newQty > stock) { showToast(`⚠️ Only ${stock} units available`); return; }
  cart[idx].qty = newQty;
  saveCart();
  updateCartUI();
}
function getSubtotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function getDiscount() { return couponApplied ? Math.round(getSubtotal() * 0.2) : 0; }
function getShipping() {
  const d = document.querySelector('input[name="delivery"]:checked');
  if (!d) return 0;
  if (d.value === 'express') return 149;
  if (d.value === 'same') return 299;
  return getSubtotal() >= 2999 ? 0 : 99;
}
function getTotal() { return getSubtotal() - getDiscount() + getShipping(); }

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartItemsCount').textContent = count;

  const list = document.getElementById('cartItemsList');
  const foot = document.getElementById('cartFoot');
  if (!cart.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🛒</div><p>Your cart is empty.<br>Add some items to get started!</p></div>`;
    foot.style.display = 'none';
    return;
  }
  list.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" onerror="this.parentElement.innerHTML='<div class=cart-item-img-ph>${item.name[0]}</div>'">` : `<div class="cart-item-img-ph">${item.name[0]}</div>`}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Size: ${item.size}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${idx},-1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx},1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${idx})" title="Remove">✕</button>
        </div>
      </div>
    </div>`).join('');

  const sub = getSubtotal(), disc = getDiscount(), ship = getShipping();
  document.getElementById('cartSubtotal').textContent = '₹' + sub.toLocaleString();
  document.getElementById('cartShipping').textContent = ship === 0 ? 'FREE' : '₹' + ship;
  document.getElementById('cartDiscount').textContent = disc > 0 ? '-₹' + disc.toLocaleString() : '—';
  document.getElementById('cartTotal').textContent = '₹' + (sub - disc + ship).toLocaleString();
  foot.style.display = 'block';
}
function openCart() {
  updateCartUI();
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartSidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartSidebar').classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════
   CHECKOUT NAVIGATION & ACCOUNT MODAL
══════════════════════════════════════════════════ */
function goToCheckout() {
  if (cart.length === 0) {
    showToast('🛒 Your cart is empty');
    return;
  }
  if (currentUser) {
    window.location.href = 'checkout/checkout.html';
  } else {
    openAuth('signup', () => {
      window.location.href = 'checkout/checkout.html';
    });
  }
}

function openAccount() {
  requireAuth(() => {
    document.getElementById('accName').textContent = currentUser.firstName + ' ' + (currentUser.lastName || '');
    document.getElementById('accEmail').textContent = currentUser.email;
    document.getElementById('accAvatar').textContent = currentUser.firstName[0].toUpperCase();
    document.getElementById('accountModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    fetchOrders();
  });
}

function closeAccount() {
  document.getElementById('accountModal').classList.remove('open');
  if(!document.getElementById('cartOverlay').classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

async function fetchOrders() {
  const list = document.getElementById('orderHistoryList');
  if (!list) return;
  list.innerHTML = '<div class="empty-state"><p>Loading orders...</p></div>';
  try {
    const snapshot = await db.collection('orders').where('userId', '==', currentUser.id).get();
    if (snapshot.empty) {
      list.innerHTML = '<div class="empty-state"><p>No orders found.</p></div>';
      return;
    }
    
    let orders = [];
    snapshot.forEach(doc => orders.push(doc.data()));
    // Sort in Javascript to avoid needing a Firestore Composite Index
    orders.sort((a, b) => {
      const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });

    let html = '';
    orders.forEach(order => {
      const date = order.createdAt ? order.createdAt.toDate().toLocaleDateString() : 'N/A';
      html += `<div class="order-card" style="border:1px solid var(--border);padding:16px;margin-bottom:12px;border-radius:4px;background:var(--surface)">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="font-family:'Space Mono',monospace;color:var(--accent);font-weight:700">#${order.orderId}</span>
          <span style="font-size:12px;color:var(--text2)">${date}</span>
        </div>
        <div style="font-size:14px;margin-bottom:8px">Total: ₹${order.total.toLocaleString()} • Items: ${order.items.length}</div>
        <div style="font-size:12px;color:var(--text2)">Status: <span style="color:var(--green)">Processing</span></div>
      </div>`;
    });
    list.innerHTML = html;
  } catch (err) {
    console.error(err);
    list.innerHTML = '<div class="empty-state"><p>Failed to load orders. Make sure Firestore rules allow reading.</p></div>';
  }
}

function applyCoupon() {
  const code = document.getElementById('couponInput')?.value.trim().toUpperCase() || '';
  if (code === 'FLESX20' || code === 'FLESX') {
    couponApplied = true; showToast('🎉 20% coupon applied!'); updateCartUI();
  } else { showToast('❌ Invalid coupon code'); }
}

/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── MOBILE NAV ── */
function openMobileNav() { document.getElementById('mobileNav').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMobileNav() { document.getElementById('mobileNav').classList.remove('open'); document.body.style.overflow = ''; }

/* ── Close modals on overlay click ── */
document.getElementById('productModal').addEventListener('click', e => { if (e.target === document.getElementById('productModal')) closeProductModal(); });
document.getElementById('checkoutModal').addEventListener('click', e => { if (e.target === document.getElementById('checkoutModal')) closeCheckout(); });
document.getElementById('authModal').addEventListener('click', e => { if (e.target === document.getElementById('authModal')) closeAuth(); });

/* ── INIT ── */
function initApp() {
  cart = JSON.parse(localStorage.getItem('flesx_cart')) || [];
  if (document.getElementById('productGrid')) {
    // If there is search text, re-apply it instead of rendering all products
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value) {
      handleSearch(searchInput.value);
    } else {
      renderProducts(getCurrentFilter());
    }
  }
  updateCartUI();
  updateWishUI();
  renderNavUser();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    initApp();
  }
});
