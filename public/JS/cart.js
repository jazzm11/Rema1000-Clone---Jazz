// Function to render the cart items from localStorage

// const cart = localStorage.setItem("cart") || [];

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.ProduktImg}" alt="${item.Navn}" />
      <h4>${item.Navn}</h4>
      <p>Price: ${item.Pris} kr</p>
      <p>Quantity: ${item.quantity}</p>
      <p>Stock: ${item.Lager}</p> 
      <div> 
        <button class="decrease-btn">-</button>
        <button class="increase-btn">+</button>
      </div>
      <button class="remove-btn">Remove</button>
    `;
    div.querySelector(".decrease-btn").addEventListener("click", () => {
      decrease(item.ProduktID);
    });
    div.querySelector(".increase-btn").addEventListener("click", () => {
      increase(item.ProduktID);
    });
    div.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromCart(item.ProduktID);
    });
    cartList.appendChild(div);
  });
  renderTotalPrice(cart);
}

function renderTotalPrice(cart) {
  const total = cart.reduce((sum, item) => sum + item.Pris * item.quantity, 0);
  let totalDiv = document.getElementById("cart-total");
  if (!totalDiv) {
    totalDiv = document.createElement("div");
    totalDiv.id = "cart-total";
    document.body.appendChild(totalDiv);
  }
  totalDiv.innerHTML = `
  <h3>Total: ${parseInt(total)} kr</h3>
  <p>Items in cart: ${item.quantity}</p>
  <button id="checkout-btn">Checkout</button>
  `;
  document.getElementById("checkout-btn").addEventListener("click", checkout);
}

function increase(productId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((item) => item.ProduktID === productId);
  if (item) {
    if (item.quantity < item.Lager) {
      item.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    } else {
      alert(`Only ${item.Lager} in stock!`);
    }
  } else {
    console.error("Product not found in cart");
  }
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.ProduktID !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decrease(productId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((item) => item.ProduktID === productId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      removeFromCart(productId);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

async function checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Send cart to backend to update stock
  const response = await fetch(
    "https://rema1000-clone-jazz.onrender.com/api/checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    }
  );

  const result = await response.json();
  if (result.success) {
    localStorage.removeItem("cart");
    renderCart();
    alert("Thank you for your purchase!");
  } else {
    alert(result.message || "Checkout failed.");
  }
}

// Call renderCart on page load
window.addEventListener(
  "DOMContentLoaded",
  renderCart()
);
