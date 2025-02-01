// Адаптація бургера
document.querySelector('.menu-toggle').addEventListener('click', () => {
    const navMenu = document.querySelector('nav ul');
    navMenu.classList.toggle('open');  // Додає/видаляє клас для відкриття меню
  });
  // Generate a random order number
  function generateOrderNumber() {
    const orderNumber = Math.floor(Math.random() * 1000000) + 1;
    document.getElementById("order-number").textContent = orderNumber;
}
window.onload = generateOrderNumber;