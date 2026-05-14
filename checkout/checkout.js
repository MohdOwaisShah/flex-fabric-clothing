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

let currentUser = null;
let cart = JSON.parse(localStorage.getItem('flesx_cart')) || [];
const SHIPPING_COST = 100;

// Auth check
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = { 
      id: user.uid, 
      email: user.email, 
      firstName: user.displayName ? user.displayName.split(' ')[0] : 'User', 
      lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '' 
    };
    document.getElementById('userEmailDisplay').textContent = currentUser.email;
    document.getElementById('chkFirst').value = currentUser.firstName;
    document.getElementById('chkLast').value = currentUser.lastName;
    document.getElementById('chkCardName').value = currentUser.firstName + ' ' + (currentUser.lastName || '');
  } else {
    // Redirect to home if not logged in
    window.location.href = '../index.html';
  }
});

// Format Expiry Date
document.getElementById('chkCardExp').addEventListener('input', function (e) {
  let v = this.value.replace(/\D/g, '');
  if (v.length > 2) {
    v = v.substring(0, 2) + '/' + v.substring(2, 4);
  }
  this.value = v;
});

function initCheckout() {
  if (cart.length === 0) {
    window.location.href = '../index.html';
    return;
  }
  
  renderOrderItems();
}

function renderOrderItems() {
  const container = document.getElementById('orderItems');
  let subtotal = 0;
  
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    
    return `
    <div class="summary-item">
      <div class="summary-item-img">
        <img src="${item.image}" alt="${item.name}">
        <div class="summary-item-qty">${item.qty}</div>
      </div>
      <div class="summary-item-details">
        <div class="summary-item-title">${item.name}</div>
        <div class="summary-item-meta">Size: ${item.size}</div>
      </div>
      <div class="summary-item-price">₹${itemTotal.toLocaleString()}</div>
    </div>
    `;
  }).join('');
  
  const total = subtotal + SHIPPING_COST;
  
  document.getElementById('sumSubtotal').textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById('sumShipping').textContent = `₹${SHIPPING_COST.toLocaleString()}`;
  document.getElementById('sumTotal').textContent = `₹${total.toLocaleString()}`;
}

function showError(msg) {
  const errEl = document.getElementById('checkoutError');
  errEl.textContent = msg;
  errEl.style.display = 'block';
  setTimeout(() => { errEl.style.display = 'none'; }, 4000);
}

async function processPayment() {
  const fname = document.getElementById('chkFirst').value.trim();
  const lname = document.getElementById('chkLast').value.trim();
  const address = document.getElementById('chkAddress').value.trim();
  const city = document.getElementById('chkCity').value.trim();
  const state = document.getElementById('chkState').value;
  const pin = document.getElementById('chkPin').value.trim();
  const cardNum = document.getElementById('chkCardNum').value.trim();
  const cardExp = document.getElementById('chkCardExp').value.trim();
  const cardCvv = document.getElementById('chkCardCvv').value.trim();
  const cardName = document.getElementById('chkCardName').value.trim();
  
  if(!fname || !lname || !address || !city || !state || !pin) {
    showError("Please fill in all delivery fields.");
    return;
  }

  if(!cardNum || !cardExp || !cardCvv || !cardName) {
    showError("Please fill in all payment fields.");
    return;
  }
  
  if(cardNum !== "1") {
    showError("Payment Failed. (Hint: Use '1' as card number)");
    return;
  }

  if(!/^\d{2}\/\d{2}$/.test(cardExp)) {
    showError("Please enter a valid expiration date (MM/YY).");
    return;
  }
  
  const [expM, expY] = cardExp.split('/').map(Number);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = parseInt(now.getFullYear().toString().slice(-2));
  
  if (expM < 1 || expM > 12) {
    showError("Invalid expiration month.");
    return;
  }
  if (expY < currentYear || (expY === currentYear && expM < currentMonth)) {
    showError("Your card has expired. Please use a future date.");
    return;
  }

  if(cardCvv !== "123") {
    showError("Payment Failed. Security code must be 123.");
    return;
  }
  
  const btn = document.getElementById('payBtn');
  btn.textContent = "Processing...";
  btn.disabled = true;
  
  try {
    let subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const orderId = 'FF-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const orderData = {
      userId: currentUser.id,
      orderId: orderId,
      items: cart,
      subtotal: subtotal,
      shipping: SHIPPING_COST,
      total: subtotal + SHIPPING_COST,
      status: "Processing",
      shippingAddress: {
        firstName: fname,
        lastName: lname,
        address: address,
        city: city,
        state: state,
        pin: pin
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // Save to Firestore
    await db.collection('orders').add(orderData);
    
    // Clear cart
    localStorage.removeItem('flesx_cart');
    
    // Show success
    document.getElementById('successOverlay').classList.add('show');
    
  } catch (err) {
    console.error("Order error: ", err);
    showError("An error occurred while placing the order.");
    btn.textContent = "Pay Now";
    btn.disabled = false;
  }
}

// Initialize on load
initCheckout();
