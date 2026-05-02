// =========================
// AgriConnect Frontend JS
// Uses localStorage only
// =========================

let generatedOTP = "";
let selectedCategory = "All";

const defaultImage = "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=700";

const sampleCrops = [
  {
    id: 101,
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: 30,
    quantity: 80,
    location: "Ghazipur",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700",
    farmerName: "Ramesh Kumar"
  },
  {
    id: 102,
    name: "Organic Potatoes",
    category: "Vegetables",
    price: 25,
    quantity: 120,
    location: "Varanasi",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700",
    farmerName: "Suresh Yadav"
  },
  {
    id: 103,
    name: "Bananas",
    category: "Fruits",
    price: 40,
    quantity: 60,
    location: "Lucknow",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=700",
    farmerName: "Mahesh Patel"
  },
  {
    id: 104,
    name: "Wheat",
    category: "Grains",
    price: 28,
    quantity: 300,
    location: "Kanpur",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=700",
    farmerName: "Amit Singh"
  }
];

const sampleEquipment = [
  {
    id: 201,
    name: "Tractor",
    rent: 1500,
    location: "Ghazipur",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=700"
  },
  {
    id: 202,
    name: "Harvester",
    rent: 3000,
    location: "Varanasi",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1627920769842-6887c6df05ca?w=700"
  },
  {
    id: 203,
    name: "Water Pump",
    rent: 500,
    location: "Lucknow",
    availability: "Not Available",
    image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=700"
  }
];

function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  if (navLinks) navLinks.classList.toggle("active");
}

function getData(key, fallback) {
  return JSON.parse(localStorage.getItem(key)) || fallback;
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLoggedInUser() {
  return getData("loggedInUser", null);
}

function showUserDetails() {
  const userDetails = document.getElementById("userDetails");
  const user = getLoggedInUser();

  if (userDetails) {
    if (user) {
      userDetails.innerText = `${user.name} | ${user.method}: ${user.contact} | Role: ${user.role}`;
    } else {
      userDetails.innerText = "Demo user | Please login for saved details";
    }
  }
}

// Login input placeholder changes based on method
function changeLoginPlaceholder() {
  const method = document.getElementById("loginMethod").value;
  const loginInput = document.getElementById("loginInput");

  if (method === "mobile") {
    loginInput.placeholder = "Enter your mobile number";
  } else {
    loginInput.placeholder = "Enter your email";
  }
}

// Demo OTP generation
function sendOTP() {
  generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
  localStorage.setItem("demoOTP", generatedOTP);
  alert("Demo OTP is " + generatedOTP);
}

// Role based login redirect
function loginUser() {
  const role = document.getElementById("role").value;
  const method = document.getElementById("loginMethod").value;
  const name = document.getElementById("userName").value.trim();
  const contact = document.getElementById("loginInput").value.trim();
  const password = document.getElementById("password").value.trim();
  const otp = document.getElementById("otpInput").value.trim();
  const savedOTP = localStorage.getItem("demoOTP");

  if (!role || !name || !contact || !password || !otp) {
    alert("Please fill all details.");
    return;
  }

  if (otp !== savedOTP) {
    alert("Wrong OTP. Click Send OTP and enter the correct demo OTP.");
    return;
  }

  const user = {
    role,
    method,
    name,
    contact
  };

  setData("loggedInUser", user);

  if (role === "farmer") {
    window.location.href = "farmer.html";
  } else if (role === "buyer") {
    window.location.href = "buyer.html";
  } else if (role === "equipment") {
    window.location.href = "equipment.html";
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  alert("Logged out successfully.");
  window.location.href = "login.html";
}

// =========================
// Farmer Page
// =========================

function initFarmerPage() {
  showUserDetails();
  renderFarmerProducts();
}

function saveCrop(event) {
  event.preventDefault();

  const user = getLoggedInUser();
  const crops = getData("crops", []);
  const editId = document.getElementById("cropEditId").value;

  const crop = {
    id: editId ? Number(editId) : Date.now(),
    name: document.getElementById("cropName").value.trim(),
    category: document.getElementById("cropCategory").value,
    price: Number(document.getElementById("cropPrice").value),
    quantity: Number(document.getElementById("cropQuantity").value),
    location: document.getElementById("cropLocation").value.trim(),
    image: document.getElementById("cropImage").value.trim() || defaultImage,
    farmerName: user ? user.name : "Demo Farmer"
  };

  if (editId) {
    const index = crops.findIndex(item => item.id === Number(editId));
    crops[index] = crop;
    alert("Crop updated successfully.");
  } else {
    crops.push(crop);
    alert("Crop added successfully.");
  }

  setData("crops", crops);
  document.getElementById("cropForm").reset();
  document.getElementById("cropEditId").value = "";
  renderFarmerProducts();
}

function renderFarmerProducts() {
  const container = document.getElementById("farmerProducts");
  const totalProducts = document.getElementById("totalProducts");
  if (!container) return;

  const crops = getData("crops", []);

  if (totalProducts) totalProducts.innerText = crops.length;

  if (crops.length === 0) {
    container.innerHTML = `<p class="muted">No crops added yet. Add your first crop using the form.</p>`;
    return;
  }

  container.innerHTML = crops.map(crop => `
    <div class="product-card">
      <img src="${crop.image}" alt="${crop.name}" />
      <h3>${crop.name}</h3>
      <p>Category: ${crop.category}</p>
      <p>₹${crop.price}/kg | ${crop.quantity} kg</p>
      <p>Location: ${crop.location}</p>
      <div class="card-actions">
        <button onclick="editCrop(${crop.id})">Edit</button>
        <button class="delete-btn" onclick="deleteCrop(${crop.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

function editCrop(id) {
  const crops = getData("crops", []);
  const crop = crops.find(item => item.id === id);
  if (!crop) return;

  document.getElementById("cropEditId").value = crop.id;
  document.getElementById("cropName").value = crop.name;
  document.getElementById("cropCategory").value = crop.category;
  document.getElementById("cropPrice").value = crop.price;
  document.getElementById("cropQuantity").value = crop.quantity;
  document.getElementById("cropLocation").value = crop.location;
  document.getElementById("cropImage").value = crop.image;

  window.scrollTo({ top: 350, behavior: "smooth" });
}

function deleteCrop(id) {
  if (!confirm("Delete this crop?")) return;

  let crops = getData("crops", []);
  crops = crops.filter(item => item.id !== id);
  setData("crops", crops);
  renderFarmerProducts();
}

function predictPrice() {
  const crop = document.getElementById("priceCrop").value;
  const box = document.getElementById("predictionBox");

  const prices = {
    Tomato: "₹25 - ₹40 per kg",
    Potato: "₹20 - ₹32 per kg",
    Onion: "₹30 - ₹55 per kg",
    Wheat: "₹24 - ₹32 per kg",
    Rice: "₹35 - ₹55 per kg"
  };

  if (!crop) {
    box.innerText = "Please select a crop first.";
    return;
  }

  box.innerText = `${crop} suggested price range: ${prices[crop]}`;
}

// =========================
// Buyer Page
// =========================

function initBuyerPage() {
  showUserDetails();
  renderBuyerProducts();
  renderCart();
}

function getAllCropsForBuyer() {
  const savedCrops = getData("crops", []);

  // If no farmer crops, show sample products
  if (savedCrops.length === 0) {
    return sampleCrops;
  }

  return [...savedCrops, ...sampleCrops];
}

function setCategory(category) {
  selectedCategory = category;
  renderBuyerProducts();
}

function renderBuyerProducts() {
  const container = document.getElementById("buyerProducts");
  const searchInput = document.getElementById("searchInput");
  if (!container) return;

  const searchText = searchInput ? searchInput.value.toLowerCase() : "";
  let products = getAllCropsForBuyer();

  if (selectedCategory !== "All") {
    products = products.filter(product => product.category === selectedCategory);
  }

  if (searchText) {
    products = products.filter(product =>
      product.name.toLowerCase().includes(searchText) ||
      product.location.toLowerCase().includes(searchText)
    );
  }

  if (products.length === 0) {
    container.innerHTML = `<p class="muted">No products found.</p>`;
    return;
  }

  container.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image || defaultImage}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>Farmer: ${product.farmerName || "Demo Farmer"}</p>
      <p>₹${product.price}/kg | ${product.quantity} kg</p>
      <p>Location: ${product.location}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `).join("");
}

function addToCart(id) {
  const products = getAllCropsForBuyer();
  const product = products.find(item => item.id === id);

  if (!product) return;

  const cart = getData("cart", []);
  cart.push(product);
  setData("cart", cart);

  alert(`${product.name} added to cart.`);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems) return;

  const cart = getData("cart", []);
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  if (cartCount) cartCount.innerText = cart.length;
  if (cartTotal) cartTotal.innerText = total;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="muted">Cart is empty.</p>`;
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <strong>${item.name}</strong>
      <p>₹${item.price}/kg</p>
      <button onclick="removeFromCart(${index})">Remove</button>
    </div>
  `).join("");
}

function removeFromCart(index) {
  const cart = getData("cart", []);
  cart.splice(index, 1);
  setData("cart", cart);
  renderCart();
}

function checkout() {
  const cart = getData("cart", []);

  if (cart.length === 0) {
    alert("Cart is empty.");
    return;
  }

  localStorage.removeItem("cart");
  alert("Order placed successfully.");
  renderCart();
}

// =========================
// Equipment Page
// =========================

function initEquipmentPage() {
  showUserDetails();

  const equipment = getData("equipment", []);
  if (equipment.length === 0) {
    setData("equipment", sampleEquipment);
  }

  renderEquipment();
}

function saveEquipment(event) {
  event.preventDefault();

  const equipmentList = getData("equipment", []);
  const editId = document.getElementById("equipmentEditId").value;

  const equipment = {
    id: editId ? Number(editId) : Date.now(),
    name: document.getElementById("equipmentName").value.trim(),
    rent: Number(document.getElementById("equipmentRent").value),
    location: document.getElementById("equipmentLocation").value.trim(),
    availability: document.getElementById("equipmentAvailability").value,
    image: document.getElementById("equipmentImage").value.trim() || defaultImage
  };

  if (editId) {
    const index = equipmentList.findIndex(item => item.id === Number(editId));
    equipmentList[index] = equipment;
    alert("Equipment updated successfully.");
  } else {
    equipmentList.push(equipment);
    alert("Equipment listed successfully.");
  }

  setData("equipment", equipmentList);
  event.target.reset();
  document.getElementById("equipmentEditId").value = "";
  renderEquipment();
}

function renderEquipment() {
  const container = document.getElementById("equipmentList");
  const listedEquipment = document.getElementById("listedEquipment");
  if (!container) return;

  const equipment = getData("equipment", []);

  if (listedEquipment) listedEquipment.innerText = equipment.length;

  container.innerHTML = equipment.map(item => `
    <div class="product-card">
      <img src="${item.image || defaultImage}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>Rent: ₹${item.rent}/day</p>
      <p>Location: ${item.location}</p>
      <p>Status: ${item.availability}</p>
      <div class="card-actions">
        <button onclick="editEquipment(${item.id})">Edit</button>
        <button class="delete-btn" onclick="deleteEquipment(${item.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

function editEquipment(id) {
  const equipment = getData("equipment", []);
  const item = equipment.find(eq => eq.id === id);
  if (!item) return;

  document.getElementById("equipmentEditId").value = item.id;
  document.getElementById("equipmentName").value = item.name;
  document.getElementById("equipmentRent").value = item.rent;
  document.getElementById("equipmentLocation").value = item.location;
  document.getElementById("equipmentAvailability").value = item.availability;
  document.getElementById("equipmentImage").value = item.image;

  window.scrollTo({ top: 250, behavior: "smooth" });
}

function deleteEquipment(id) {
  if (!confirm("Delete this equipment?")) return;

  let equipment = getData("equipment", []);
  equipment = equipment.filter(item => item.id !== id);
  setData("equipment", equipment);
  renderEquipment();
}
