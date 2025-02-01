// Адаптація бургера
document.querySelector('.menu-toggle').addEventListener('click', () => {
    const navMenu = document.querySelector('nav ul');
    navMenu.classList.toggle('open');  // Додає/видаляє клас для відкриття меню
  });


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
