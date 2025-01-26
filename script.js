// Масив для зберігання товарів, які додані до кошика
let cart = [];

// Звернення до елементів DOM
const cartItems = document.getElementById("cart-popup-items");
const totalPriceElement = document.getElementById("cart-popup-total");
const checkoutButton = document.getElementById("cart-popup-checkout");
const orderFormSection = document.getElementById("order-form");
const confirmationSection = document.getElementById("confirmation");
const orderNumberElement = document.getElementById("order-number");
const productList = document.querySelector(".product-list");
const sortOptions = document.getElementById("sort-options");
const filterOptions = document.getElementById("filter-options");
const cartIcon = document.getElementById("cart-icon");
const cartPopup = document.getElementById("cart-popup");
const cartPopupItems = document.getElementById("cart-popup-items");
const cartPopupTotal = document.getElementById("cart-popup-total");
const cartCount = document.getElementById("cart-count");
// Доступ до елементів пошуку
const searchIcon = document.getElementById('search-icon'); // Іконка лупи
const searchInput = document.getElementById('search-input'); // Поле вводу пошуку

// Відображення/приховування поля пошуку
searchIcon.addEventListener('click', () => {
  searchInput.classList.toggle('active'); // Перемикаємо видимість поля
  if (searchInput.classList.contains('active')) {
    searchInput.focus(); // Фокусуємо поле пошуку
  } else {
    searchInput.value = ''; // Очищаємо текст при закритті
    resetSearchResults(); // Повертаємо весь список товарів
  }
});

// Обробка пошуку
searchInput.addEventListener('input', () => {
  const searchText = searchInput.value.toLowerCase().trim(); // Отримуємо текст із поля пошуку

  // Фільтруємо товари на основі пошуку
  const searchedProducts = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(searchText)
  );

  // Оновлюємо відображення товарів
  currentPage = 1; // Повертаємося на першу сторінку
  setupPagination(searchedProducts); // Оновлюємо кнопки пагінації
  displayProducts(searchedProducts, currentPage); // Відображаємо результати
});

// Скидання пошуку
function resetSearchResults() {
  displayProducts(filteredProducts, currentPage); // Відображаємо весь асортимент
  setupPagination(filteredProducts); // Оновлюємо кнопки пагінації
}



// Додаємо подію для відображення/приховування спливаючого вікна
cartIcon.addEventListener("click", () => {
  cartPopup.style.display = cartPopup.style.display === "none" || !cartPopup.style.display ? "block" : "none";
});

function updateCartPopup() {
  // Оновлення вмісту спливаючого вікна
  cartPopupItems.innerHTML = cart.map((item, index)=> `
    <div class="cart-item">
      <p>${item.name} - ${item.price} грн × ${item.quantity} = ${item.price * item.quantity} грн</p>
      <button class="deleteButton" data-index="${index}">Видалити</button>
    </div>
  `).join("");

  // Розрахунок загальної суми
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartPopupTotal.textContent = `Загальна сума: ${totalPrice} грн`;

  // Оновлення лічильника кількості товарів
  cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);

  document.querySelectorAll(".deleteButton").forEach(button => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;
      cart.splice(index, 1);
      updateCartPopup();
      cartCount.textContent = cart.length;
    });
  });
}


// Викликайте `updateCartPopup()` після кожного додавання товару в кошик:
function addToCart(event) {
  const button = event.target;
  const productId = button.dataset.id;
  const productName = button.dataset.name;
  const productPrice = parseFloat(button.dataset.price);
  const quantityInput = button.previousElementSibling.querySelector(".quantity-input");
  const quantity = parseInt(quantityInput.value) || 1;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, name: productName, price: productPrice, quantity });
  }

  quantityInput.value = 1; // Скидання кількості до 1
  updateCart();
  updateCartPopup(); // Оновлення вмісту кошика
}
document.getElementById("cart-popup-checkout").addEventListener("click", () => {
  location.href = 'checkout/checkout.html';
});

let productsPerPage = 8; // Кількість продуктів на сторінці
let currentPage = 1; // Поточна сторінка

// Відображення продуктів для конкретної сторінки
function displayProducts(products, page = 1) {
  const productList = document.querySelector('.product-list');
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  productList.innerHTML = ''; // Очищуємо попередній список продуктів
  products.slice(startIndex, endIndex).forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('productProto', product.category);
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="productProto__img">
      <h3 class="productProto__title">${product.name}</h3>
      <p class="productProto__price">Ціна: ${product.price} грн</p>
      <div class="productProto__priceButton quantity-container">
        <button class="quantity-btn decrease" data-id="${product.id}">-</button>
        <input type="number" class="quantity-input" value="1" min="1" data-id="${product.id}">
        <button class="quantity-btn increase" data-id="${product.id}">+</button>
      </div>
      <button class="add-to-cart" data-id="${product.id}" data-price="${product.price}" data-name="${product.name}">
        Додати в кошик
      </button>
    `;
    productList.appendChild(productDiv);
  });

  // Додаємо обробники для кнопок "Додати в кошик"
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
      addToCart(event);
    });
  });

  // Обробники для зміни кількості товарів
  document.querySelectorAll('.increase').forEach(button => {
    button.addEventListener('click', updateQuantity);
  });
  document.querySelectorAll('.decrease').forEach(button => {
    button.addEventListener('click', updateQuantity);
  });
}



// Налаштування пагінації
function setupPagination(products) {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(products.length / productsPerPage);

  pagination.innerHTML = ''; // Очищуємо попередні кнопки пагінації

  // Додаємо стрілку "Назад", якщо це не перша сторінка
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.textContent = '«';
    prevButton.classList.add('page-button');
    prevButton.addEventListener('click', () => {
      currentPage -= 1;
      displayProducts(products, currentPage);
      setupPagination(products);
    });
    pagination.appendChild(prevButton);
  }

  // Діапазон сторінок для відображення
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('page-button');
    if (i === currentPage) pageButton.classList.add('active');
    pageButton.addEventListener('click', () => {
      currentPage = i;
      displayProducts(products, currentPage);
      setupPagination(products);
    });
    pagination.appendChild(pageButton);
  }

  // Додаємо стрілку "Вперед", якщо це не остання сторінка
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.textContent = '»';
    nextButton.classList.add('page-button');
    nextButton.addEventListener('click', () => {
      currentPage += 1;
      displayProducts(products, currentPage);
      setupPagination(products);
    });
    pagination.appendChild(nextButton);
  }
}



// Завантаження продуктів із JSON
function loadProducts() {
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      filteredProducts = products; // Зберігаємо продукти глобально
      displayProducts(filteredProducts, currentPage);
      setupPagination(filteredProducts);
    });
}
// Оновлення кількості продуктів на основі ширини екрану
function updateProductsPerPage() {
  if (window.innerWidth <= 768) {
    productsPerPage = 4;
  } else {
    productsPerPage = 8;
  }
  loadProducts();
}

window.addEventListener('resize', updateProductsPerPage);
document.addEventListener('DOMContentLoaded', updateProductsPerPage);


// Функція для оновлення кількості товару
function updateQuantity(event) {
  const button = event.target;
  const input = button.closest('.quantity-container').querySelector('.quantity-input');
  let currentValue = parseInt(input.value);

  if (button.classList.contains('increase')) {
    input.value = currentValue + 1;
  } else if (button.classList.contains('decrease') && currentValue > 1) {
    input.value = currentValue - 1;
  }
}

// Функція для оновлення відображення кошика
function updateCart() {
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <p>${item.name} - ${item.price} грн × ${item.quantity} = ${item.price * item.quantity} грн</p>
      <button class="deleteButton" data-index="${index}">Видалити</button>
    </div>
  `).join("");

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceElement.textContent = `Загальна сума: ${totalPrice} грн`;

  document.querySelectorAll(".deleteButton").forEach(button => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;
      cart.splice(index, 1);
      updateCart();
    });
  });
}

// Додавання події введення тексту у пошукове поле
function loadProducts() {
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      filteredProducts = products; // Зберігаємо продукти глобально
      displayProducts(filteredProducts, currentPage);
      setupPagination(filteredProducts);
    });
}



// Функція для фільтрації товарів
let filteredProducts = []; // Масив для зберігання відфільтрованих продуктів

function filterProducts(category) {
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      // Зберігаємо відфільтровані продукти в глобальній змінній
      filteredProducts = category === "all" 
        ? products 
        : products.filter(product => product.category === category);

      currentPage = 1; // Скидаємо пагінацію на першу сторінку
      setupPagination(filteredProducts); // Оновлюємо кнопки пагінації
      displayProducts(filteredProducts, currentPage); // Відображаємо продукти для поточної сторінки
    })
    .catch(error => console.error("Помилка при фільтрації:", error));
}



// Додаємо обробник подій для зміни фільтра
filterOptions.addEventListener("change", (e) => {
  const selectedCategory = e.target.value;
  filterProducts(selectedCategory); // Викликаємо фільтрацію
});


// Функція для сортування товарів
function sortProducts(criteria) {
  // Сортуємо весь асортимент `filteredProducts`, а не тільки видимі на сторінці
  filteredProducts.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    const priceA = a.price;
    const priceB = b.price;

    switch (criteria) {
      case "name-asc":
        return nameA.localeCompare(nameB);
      case "name-desc":
        return nameB.localeCompare(nameA);
      case "price-asc":
        return priceA - priceB;
      case "price-desc":
        return priceB - priceA;
      default:
        return 0;
    }
  });

  // Після сортування оновлюємо відображення
  currentPage = 1; // Повертаємося на першу сторінку
  displayProducts(filteredProducts, currentPage); // Відображаємо продукти
  setupPagination(filteredProducts); // Оновлюємо пагінацію
}

// Додаємо обробник подій для сортування
sortOptions.addEventListener("change", (e) => {
  const selectedCriteria = e.target.value;
  sortProducts(selectedCriteria);
});


// Додаємо обробник подій для зміни сортування
sortOptions.addEventListener("change", (e) => {
  sortProducts(e.target.value);
});

// Обробник події для кнопки "Оформити замовлення"
checkoutButton.addEventListener("click", () => {
  document.querySelector("main").style.display = "none";
  orderFormSection.style.display = "block";
});

// Обробник події для підтвердження замовлення
document.getElementById("order-form-element").addEventListener("submit", (e) => {
  e.preventDefault();
  const orderNumber = Math.floor(Math.random() * 1000000);
  orderNumberElement.textContent = orderNumber;
  orderFormSection.style.display = "none";
  confirmationSection.style.display = "block";
});

// Завантажуємо продукти при завантаженні сторінки
loadProducts();
document.addEventListener("DOMContentLoaded", () => {
  const checkoutButton = document.getElementById("cart-popup-checkout");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      location.href = 'checkout/checkout.html';
    });
  } else {
    console.error("Element with id 'cart-popup-checkout' not found.");
  }
});
;

