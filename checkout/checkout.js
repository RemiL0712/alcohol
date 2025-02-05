// Адаптація бургера
document.querySelector('.menu-toggle').addEventListener('click', () => {
    const navMenu = document.querySelector('nav ul');
    navMenu.classList.toggle('open');  // Додає/видаляє клас для відкриття меню
  });

<<<<<<< HEAD

  // Відправка данних

  document.querySelector('#order-form-element').addEventListener('submit', function(event) {
    event.preventDefault();  // Перешкоджає стандартному відправленню форми

    const formData = new FormData(this);

    fetch('your-server-endpoint', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        alert('Ваше замовлення успішно відправлено!');
        window.location.href = "../confirmation/confirmation.html";  // Перенаправлення на сторінку підтвердження
    })
    .catch(error => {
        alert('Щось пішло не так, спробуйте ще раз!');
    });
});
=======
  
  document.addEventListener("DOMContentLoaded", () => {
    // Завантажуємо кошик з localStorage
    const storedCart = localStorage.getItem('cart');
    const storedTotalPrice = localStorage.getItem('totalPrice');
    
    if (storedCart) {
      const cart = JSON.parse(storedCart); // Відновлюємо кошик
      const cartItemsContainer = document.createElement('div');
      
      // Створюємо список товарів для відображення
      cartItemsContainer.innerHTML = cart.map(item => `
        <p>${item.name} - ${item.price} грн × ${item.quantity} = ${item.price * item.quantity} грн</p>
      `).join('');
      
      // Додаємо список товарів на сторінку
      const cartSummary = document.createElement('div');
      cartSummary.innerHTML = `<p>Загальна сума: ${storedTotalPrice} грн</p>`;
  
      // Вставляємо товарні елементи і суму на форму
      const form = document.querySelector('form');
      form.insertBefore(cartItemsContainer, form.firstChild); // Товари перед полем "Ім'я"
      form.appendChild(cartSummary); // Сума після кнопки
  
      // Заповнюємо приховані поля
      document.getElementById('cart-items').value = JSON.stringify(cart); // Перетворюємо кошик у JSON і записуємо в hidden поле
      document.getElementById('total-price').value = storedTotalPrice; // Записуємо суму в hidden поле
    }
  });
  
  
  // Відправка данних

  document.querySelector('#order-form-element').addEventListener('submit', function(event) {
    event.preventDefault(); // Запобігає стандартному відправленню форми
  
    const formData = new FormData(this);
  
    fetch('https://api.web3forms.com/submit', {  // Використовуємо правильний ендпоінт
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (response.ok) {
        alert('Ваше замовлення успішно відправлено!');
        
        // Очищаємо кошик в localStorage після успішної відправки
        localStorage.removeItem('cart');
        localStorage.removeItem('totalPrice');
  
        // Перенаправляємо на головну сторінку
        window.location.href = "../index.html"; // Перехід на головну
      } else {
        throw new Error('Сервер не відповів успішно');
      }
    })
    .catch(error => {
      alert('Щось пішло не так, спробуйте ще раз!');
      console.error(error);
    });
  });
  



>>>>>>> b9b1bc6 (ABCD)
