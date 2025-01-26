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
const searchInput = document.getElementById("search-input");
const cartIcon = document.getElementById("cart-icon");
const cartPopup = document.getElementById("cart-popup");
const cartCount = document.getElementById("cart-count");

// Відображення або приховування кошика
if (cartIcon) {
    cartIcon.addEventListener("click", () => {
        cartPopup.style.display = cartPopup.style.display === "none" || !cartPopup.style.display ? "block" : "none";
    });
} else {
    console.error("Елемент #cart-icon не знайдено.");
}

// Оновлення вмісту кошика
function updateCartPopup() {
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <p>${item.name} - ${item.price} грн × ${item.quantity} = ${item.price * item.quantity} грн</p>
            <button class="deleteButton" data-index="${index}">Видалити</button>
        </div>
    `).join("");

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPriceElement.textContent = `Загальна сума: ${totalPrice} грн`;

    cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);

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

    quantityInput.value = 1;
    updateCartPopup();
}

// Глобальний обробник для кнопок "Додати в кошик"
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
        addToCart(event);
    }
});

// Глобальний обробник для кнопок збільшення/зменшення кількості
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

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("increase") || event.target.classList.contains("decrease")) {
        updateQuantity(event);
    }
});

// Відображення продуктів
let productsPerPage = 8;
let currentPage = 1;

function displayProducts(products, page = 1) {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    productList.innerHTML = '';
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
            filteredProducts = products;
            displayProducts(filteredProducts, currentPage);
            setupPagination(filteredProducts);
        })
        .catch(error => console.error("Помилка завантаження продуктів:", error));
}

// Налаштування пагінації
function setupPagination(products) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(products.length / productsPerPage);

    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
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
}

// Оновлення кількості продуктів при зміні розміру екрану
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        productsPerPage = 4;
    } else {
        productsPerPage = 8;
    }
    loadProducts();
});

// Ініціалізація завантаження продуктів
document.addEventListener("DOMContentLoaded", loadProducts);
