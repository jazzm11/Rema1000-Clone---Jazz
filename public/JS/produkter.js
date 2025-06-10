// Add to Cart functionality
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.ProduktID === product.ProduktID);

  // Check stock before adding
  if (existing) {
    if (existing.quantity < product.Lager) {
      existing.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.Navn} added to cart!`);
    } else {
      alert(`Only ${product.Lager} in stock!`);
    }
  } else {
    if (product.Lager > 0) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.Navn} added to cart!`);
    } else {
      alert("Out of stock!");
    }
  }
}


function renderProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
        <img src="${product.ProduktImg}" alt="${product.Navn}" />
      <h3>${product.Navn}</h3>
      <p>${product.Category}</p>
      <p>${product.Pris} kr</p>
      <p>Stock: ${product.Lager}</p>
      <button class="addToCart-btn">Add to cart</button>
    `;
    div.querySelector(".addToCart-btn").addEventListener("click", () => addToCart(product));
    productList.appendChild(div);
  });
}

// const BrukerID = localStorage.getItem('BrukerID');

// On page load
window.addEventListener("DOMContentLoaded", async () => {
  try {
    //    if (!BrukerID) {
    //      console.error("Ingen bruker funnet");
    //      window.localStorage.href = "/";
    //      return;
    //    }

    const respons = await fetch("https://rema1000-clone-jazz.onrender.com/api/produkter");
    if (!respons.ok) {
      throw new Error("Network response was not ok");
    }

    const alleProdukter = await respons.json();
    console.log("All products loaded:", alleProdukter);
    // Render products on the page
    renderProducts(alleProdukter);
  } catch (err) {
    document.getElementById("product-list").innerHTML =
      "<p>Could not load products.</p>";
    console.error("Error loading products:", err);
  }
});
