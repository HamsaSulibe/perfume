let products = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

fetch('products.json')
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to load products.json");
    }
    return response.json();
  })
  .then(data => {
    products = data; // Assign the fetched data to the products array
    initPage(); // Initialize the page functionality
  })
  .catch(error => {
    console.error("Error loading products:", error);
  });

function initPage() {
  loadFeaturedProducts(); // (Optional) Load featured products if any

  if (document.getElementById("perfume-product-list")) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    loadProducts(category);
  }

  if (document.getElementById("perfume-cart-items")) {
    loadCart();
  }

  if (document.getElementById("checkout-cart-items")) {
    loadCheckoutCart();
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return total.toFixed(2);
}

const featuredProducts = [
  { name: "Kayali", image: "04.jpeg", price: "$30.50" },
  { name: "Mis Dior", image: "07.jpeg", price: "$40.99" }
];

function loadFeaturedProducts() {
  const carousel = document.getElementById("perfume-featured-carousel");
  if (!carousel) return;

  featuredProducts.forEach(product => {
    const productCard = document.createElement("div");
    productCard.classList.add("perfume-product-card");
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price}</p>
      <button class="perfume-btn" onclick="addFeaturedProductToCart('${product.name}')">
        Add to Cart
      </button>
    `;
    carousel.appendChild(productCard);
  });
}

function addFeaturedProductToCart(productName) {
  const product = products.find(p => p.name === productName);
  if (product) {
    addToCart(product.id);
  }
}

function loadProducts(filter = "all") {
  const productList = document.getElementById("perfume-product-list");
  if (!productList) return;

  productList.innerHTML = "";
  const filteredProducts = products.filter(
    product => filter === "all" || product.category === filter
  );

  filteredProducts.forEach(product => {
    const productCard = document.createElement("div");
    productCard.classList.add("perfume-product-card");
    productCard.setAttribute('data-name', product.name.toLowerCase());
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Price: $${product.price.toFixed(2)}</p>
      <button class="perfume-btn" onclick="addToCart(${product.id})">
        Add to Cart
      </button>
    `;

    productCard.addEventListener("click", () => {
      openProductModal(product);
    });

    productList.appendChild(productCard);
  });
}

function filterProducts() {
  const categoryFilter = document.getElementById("perfume-category-filter");
  const filterValue = categoryFilter.value;
  loadProducts(filterValue);
}

function searchPerfumes() {
  const query = document.getElementById('search-bar-shop').value.toLowerCase();
  const products = document.querySelectorAll('.perfume-product-card');

  products.forEach(product => {
    const name = product.getAttribute('data-name');
    if (name.includes(query)) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
}

function loadCart() {
  const cartItems = document.getElementById("perfume-cart-items");
  const totalPrice = document.getElementById("perfume-total-price");
  if (!cartItems || !totalPrice) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="color:red;">Cart is empty</p>`;
    totalPrice.textContent = "Total: $0.00";
    return;
  }

  let html = "";
  cart.forEach((item, index) => {
    html += `
      <div class="cart-item">
        <img 
          src="${item.image}" 
          alt="${item.name}" 
          class="cart-item-img"
        />
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
          <button class="perfume-btn-remove" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  cartItems.innerHTML = html;
  totalPrice.textContent = `Total: $${updateCartTotal()}`;
}

function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart[index].quantity = 1;
  }
  saveCart();
  loadCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  loadCart();
}

function clearCart() {
  cart = [];
  saveCart();
  loadCart();
}

function applyDiscount() {
  const discountCode = document.getElementById("discount-code").value.trim();
  if (discountCode.toLowerCase() === "ham50") {
    cart = cart.map(item => {
      item.price *= 0.5;
      return item;
    });
    showTemporaryMessage("Discount applied! 50% off.", "green");
    saveCart();
    loadCart();
  } else {
    showTemporaryMessage("Invalid discount code!", "red");
  }
}

function loadCheckoutCart() {
  const cartItemsContainer = document.getElementById("checkout-cart-items");
  const totalPriceContainer = document.getElementById("checkout-total-price");
  if (!cartItemsContainer || !totalPriceContainer) return;

  let html = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    html += `<p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>`;
  });

  cartItemsContainer.innerHTML = html || "<p>Your cart is empty.</p>";
  totalPriceContainer.textContent = `Total: $${total.toFixed(2)}`;
}

const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("checkout-name").value;
    const email = document.getElementById("checkout-email").value;
    const address = document.getElementById("checkout-address").value;
    const phone = document.getElementById("checkout-phone").value;

    if (!name || !email || !address || !phone) {
      showTemporaryMessage("Please fill in all fields.", "red");
      return;
    }

    showTemporaryMessage(`Thank you for your order, ${name}! We will process it shortly.`, "green");
    cart = [];
    saveCart();
    window.location.href = "index.html";
  });
}

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const message = document.getElementById("contact-message").value;

    if (!name || !email || !message) {
      showTemporaryMessage("Please fill in all fields.", "red");
      return;
    }

    showTemporaryMessage(`Thank you for contacting us, ${name}! We will get back to you soon.`, "green");
    this.reset();
  });
}

function proceedToCheckout(e) {
  e.preventDefault();
  showTemporaryMessage(
    "Thank you for your order! We will process it shortly.",
    "green"
  );
  clearCart();
}

function showTemporaryMessage(text, color = "black") {
  const msgElem = document.getElementById("checkout-message");
  if (!msgElem) return;

  msgElem.style.color = color;
  msgElem.textContent = text;

  setTimeout(() => {
    msgElem.textContent = "";
  }, 3000);
}


const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalProductImage = document.getElementById("modal-product-image");
const modalProductName = document.getElementById("modal-product-name");
const modalProductDescription = document.getElementById("modal-product-description");
const modalProductPrice = document.getElementById("modal-product-price");

function openProductModal(product) {
  if (!productModal || !modalProductImage || !modalProductName || !modalProductDescription || !modalProductPrice) return;

  modalProductImage.src = product.image;
  modalProductName.textContent = product.name;
  modalProductDescription.textContent = product.description || "No description available.";
  modalProductPrice.textContent = `Price: $${product.price.toFixed(2)}`;

  productModal.style.display = "block";
}

if (closeModal) {
  closeModal.addEventListener("click", () => {
    productModal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === productModal) {
    productModal.style.display = "none";
  }
});
