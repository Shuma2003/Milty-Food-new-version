// Корзина
let cart = [];
const cartModal = document.getElementById('cartModal');
const overlay = document.getElementById('overlay');
const cartIcon = document.getElementById('cartIcon');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.querySelector('.checkout-btn');

// Открытие/закрытие корзины
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

overlay.addEventListener('click', () => {
    cartModal.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Управление количеством товаров
document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const input = this.parentElement.querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        if (this.classList.contains('minus')) {
            if (value > 1) {
                input.value = value - 1;
            }
        } else {
            input.value = value + 1;
        }
    });
});

// Добавление товара в корзину
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const id = productCard.dataset.id;
        const name = productCard.dataset.name;
        const price = parseInt(productCard.dataset.price);
        const quantity = parseInt(productCard.querySelector('.quantity-input').value);
        
        addToCart(id, name, price, quantity);
        
        // Анимация добавления
        this.textContent = 'Добавлено!';
        this.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            this.textContent = 'В корзину';
            this.style.backgroundColor = 'var(--primary-color)';
        }, 1000);
    });
});

// Функция добавления в корзину
function addToCart(id, name, price, quantity) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id, name, price, quantity });
    }
    
    updateCart();
}

// Обновление корзины
function updateCart() {
    // Обновление счетчика
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;
    
    // Обновление списка товаров
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
    } else {
        cartItems.innerHTML = '';
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="../accents/greek-salat.webp" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Обновление общей суммы
        cartTotal.textContent = `${totalPrice} ₽`;
    }
    
    // Добавление обработчиков для изменения количества в корзине
    document.querySelectorAll('.cart-item-quantity .quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            const cartItem = this.closest('.cart-item');
            const id = cartItem.querySelector('.remove-item').dataset.id;
            const item = cart.find(item => item.id === id);
            
            if (this.classList.contains('minus')) {
                if (value > 1) {
                    input.value = value - 1;
                    item.quantity = value - 1;
                }
            } else {
                input.value = value + 1;
                item.quantity = value + 1;
            }
            
            updateCart();
        });
    });
    
    // Добавление обработчиков для удаления товаров
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            cart = cart.filter(item => item.id !== id);
            updateCart();
        });
    });
}

// Оформление заказа
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    alert('Заказ оформлен! Спасибо за покупку!');
    cart = [];
    updateCart();
    cartModal.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Кнопка "Наверх"
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Плавная прокрутка для ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
