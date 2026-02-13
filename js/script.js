/* ========== DYNAMIC PRODUCTS ========== */
const productsContainer = document.getElementById('products-container');

async function loadProducts() {
  try {
    const res = await fetch('http://localhost:5000/api/products');
    const products = await res.json();
    productsContainer.innerHTML = '';

    products.forEach((product, index) => {
      const optionsHTML = product.options.map((opt, i) => 
        `<option value="${opt.price}">${opt.weight} - ₹${opt.price}</option>`).join('');

      productsContainer.innerHTML += `
        <div class="card">
          <img src="${product.image}">
          <div class="card-content">
            <h3>${product.name}</h3>
            <select id="prod-${index}-weight" onchange="updatePrice('prod-${index}')">
              ${optionsHTML}
            </select>
            <p class="price">₹<span id="prod-${index}-price">${product.options[0].price}</span></p>
            <button onclick="addToCart('${product.name}','prod-${index}-weight','prod-${index}-price','${product.image}')">Add To Cart</button>
          </div>
        </div>
      `;
    });
  } catch(err){
    console.error(err);
    productsContainer.innerHTML = '<p>Failed to load products.</p>';
  }
}

/* ========== SEARCH PRODUCTS ========== */
function searchproducts() {
  const query = document.getElementById('search').value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const name = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = name.includes(query) ? 'block' : 'none';
  });
}
document.getElementById('search').addEventListener('input', searchproducts);

/* ========== UPDATE PRICE ========== */
function updatePrice(prefix) {
  const select = document.getElementById(prefix+'-weight');
  const priceEl = document.getElementById(prefix+'-price');
  priceEl.innerText = select.value;
}

/* ========== CART FUNCTIONALITY ========== */
function addToCart(name, weightId, priceId, image){
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const weightSelect = document.getElementById(weightId);
  const weight = weightSelect.options[weightSelect.selectedIndex].text;
  const price = Number(document.getElementById(priceId).innerText);

  cart.push({name,weight,price,image});
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showPopup();
  animateCart();
}

function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountEl = document.getElementById('cartCount');
  if(cartCountEl) cartCountEl.innerText = cart.length;
}

/* ========== CART POPUP & ANIMATION ========== */
function showPopup(){
  const popup = document.getElementById("cart-popup");
  popup.classList.add("show");
  setTimeout(()=>popup.classList.remove("show"),2000);
}
function animateCart(){
  const cartIcon = document.querySelector(".cart-icon");
  cartIcon.classList.add("cart-shake");
  setTimeout(()=>cartIcon.classList.remove("cart-shake"),500);
}

/* ========== LOAD CART ON PAGE LOAD ========== */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadProducts();
});
