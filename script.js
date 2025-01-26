// Масив для зберігання товарів у кошику
let cart = [];

// DOM-елементи
const cartItems = document.getElementById("cart-popup-items");
const totalPriceElement = document.getElementById("cart-popup-total");
const cartCount = document.getElementById("cart-count");
const cartPopup = document.getElementById("cart-popup");
const cartIcon = document.getElementById("cart-icon");
const productList = document.querySelector(".product-list");



// Перевірка наявності ключових елементів
if (!cartItems || !totalPriceElement || !cartCount || !cartPopup || !cartIcon || !productList) {
    console.error("Ключові елементи для кошика не знайдено в DOM!");
}

// Оновлення кошика
function updateCartPopup() {
    // Очищення вмісту кошика
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <p>${item.name} - ${item.price} грн × ${item.quantity} = ${item.price * item.quantity} грн</p>
            <button class="deleteButton" data-index="${index}">Видалити</button>
        </div>
    `).join("");

    // Оновлення загальної суми
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPriceElement.textContent = `Загальна сума: ${totalPrice} грн`;

    // Оновлення кількості товарів у кошику
    cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);

    // Додавання обробників до кнопок видалення
    document.querySelectorAll(".deleteButton").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            cart.splice(index, 1);
            updateCartPopup();
        });
    });
}

// Додавання товару до кошика
function addToCart(event) {
    const button = event.target;

    // Зчитуємо дані продукту
    const productId = button.dataset.id;
    const productName = button.dataset.name;
    const productPrice = parseFloat(button.dataset.price);
    const quantityInput = button.previousElementSibling.querySelector(".quantity-input");
    const quantity = parseInt(quantityInput.value) || 1;

    // Перевірка наявності товару в кошику
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity });
    }

    // Скидання кількості в інпуті
    quantityInput.value = 1;

    // Оновлення кошика
    updateCartPopup();
}

// Обробник подій для кнопок "Додати в кошик"
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
        addToCart(event);
    }
});

// Зміна кількості товарів
function updateQuantity(event) {
    const button = event.target;
    const input = button.closest('.quantity-container').querySelector('.quantity-input');
    let currentValue = parseInt(input.value);

    if (button.classList.contains("increase")) {
        input.value = currentValue + 1;
    } else if (button.classList.contains("decrease") && currentValue > 1) {
        input.value = currentValue - 1;
    }
}

// Обробник подій для кнопок збільшення/зменшення кількості

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("increase") || event.target.classList.contains("decrease")) {
        updateQuantity(event);
    }
});

// Відображення продуктів
function displayProducts(products) {
    productList.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('productProto');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="productProto__img">
            <h3 class="productProto__title">${product.name}</h3>
            <p class="productProto__price">Ціна: ${product.price} грн</p>
            <div class="productProto__priceButton quantity-container">
                <button class="quantity-btn decrease" data-id="${product.id}">-</button>
                <input type="number" class="quantity-input" value="1" min="1" data-id="${product.id}">
                <button class="quantity-btn increase" data-id="${product.id}">+</button>
            </div>
            <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                Додати в кошик
            </button>
        `;
        productList.appendChild(productDiv);
    });
}

// Завантаження продуктів
function loadProducts() {
    fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            displayProducts(products);
        })
        .catch(error => console.error("Помилка завантаження продуктів:", error));
}

// Ініціалізація завантаження продуктів
document.addEventListener("DOMContentLoaded", loadProducts);

// Відображення/приховування кошика
if (cartIcon) {
    cartIcon.addEventListener("click", () => {
        cartPopup.style.display = cartPopup.style.display === "none" || !cartPopup.style.display ? "block" : "none";
    });
}
// Сортування продуктів
function sortProducts(products, criteria) {
  return products.sort((a, b) => {
      if (criteria === 'name-asc') {
          return a.name.localeCompare(b.name);
      } else if (criteria === 'name-desc') {
          return b.name.localeCompare(a.name);
      } else if (criteria === 'price-asc') {
          return a.price - b.price;
      } else if (criteria === 'price-desc') {
          return b.price - a.price;
      }
      return 0;
  });
}

// Фільтрація продуктів
function filterProducts(products, category) {
  if (category === 'all') {
      return products;
  }
  return products.filter(product => product.category === category);
}

// Пошук продуктів
function searchProducts(products, query) {
  return products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
}

// Оновлення продуктів із фільтрацією, сортуванням та пошуком
function updateDisplayedProducts(products) {
  const sortOption = document.getElementById("sort-options").value;
  const filterOption = document.getElementById("filter-options").value;
  const searchQuery = document.getElementById("search-input").value;

  let filteredProducts = filterProducts(products, filterOption);
  filteredProducts = searchProducts(filteredProducts, searchQuery);
  const sortedProducts = sortProducts(filteredProducts, sortOption);

  displayProducts(sortedProducts);
}

// Додавання обробників подій для фільтрації та сортування
document.getElementById("sort-options").addEventListener("change", () => updateDisplayedProducts(allProducts));
document.getElementById("filter-options").addEventListener("change", () => updateDisplayedProducts(allProducts));
document.getElementById("search-input").addEventListener("input", () => updateDisplayedProducts(allProducts));

// Збереження завантажених продуктів для фільтрації та сортування
let allProducts = [];
function loadProducts() {
  fetch('products.json')
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(products => {
          allProducts = products;
          updateDisplayedProducts(products);
      })
      .catch(error => console.error("Помилка завантаження продуктів:", error));
}
