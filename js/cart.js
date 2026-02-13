/* ================= CART FUNCTIONS ================= */

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemsContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("total-amount");
  const emptyMsg = document.getElementById("empty-cart");

  itemsContainer.innerHTML = "";
  let total = 0;

  if(cart.length === 0){
    if(emptyMsg) emptyMsg.style.display = "block";
  } else {
    if(emptyMsg) emptyMsg.style.display = "none";
  }

  cart.forEach((item,index)=>{
    total += item.price;
    itemsContainer.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.weight}</small><br>
          ₹${item.price}
        </div>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  if(totalEl) totalEl.innerText = total;
  updateCartCount();
}

function removeItem(index){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index,1);
  localStorage.setItem("cart",JSON.stringify(cart));
  loadCart();
}

/* ================= CART COUNT ================= */
function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountEl = document.getElementById('cartCount');
  if(cartCountEl) cartCountEl.innerText = cart.length;
}

/* ================= RAZORPAY CHECKOUT ================= */
async function checkout(){
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if(cart.length === 0) return alert("Cart is empty!");

  const total = cart.reduce((sum,item)=>sum+item.price,0);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const email = user.email || prompt("Enter your email:");

  if(!email) return alert("Email is required!");

  try{
    const res = await fetch('http://localhost:5000/api/orders/create',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({items:cart,total,email})
    });

    if(!res.ok) throw new Error("Order creation failed");
    
    const data = await res.json();

    if(!data.success) throw new Error(data.error || "Payment initiation failed");

    const options = {
      key: data.razorpayKey,
      amount: total * 100, // in paise
      currency: "INR",
      name: "Triswad",
      description: "Spices Purchase",
      order_id: data.orderId,
      handler: async function(response){
        // Payment successful - save order
        try {
          const saveRes = await fetch('http://localhost:5000/api/orders/save-order',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
              email,
              items: cart,
              amount: total,
              paymentId: response.razorpay_payment_id
            })
          });
          
          if(saveRes.ok) {
            alert("✅ Payment Successful! Order saved.");
            localStorage.removeItem("cart");
            loadCart();
            window.location.href = "index.html";
          }
        } catch(err) {
          console.error(err);
          alert("Payment successful but order save failed. Contact support.");
        }
      },
      prefill: {
        email: email
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch(err){
    console.error(err);
    alert("❌ Payment failed: " + err.message);
  }
}

/* ================= LOAD CART ON PAGE LOAD ================= */
document.addEventListener("DOMContentLoaded", loadCart);
