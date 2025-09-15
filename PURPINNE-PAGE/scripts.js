const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const items = document.querySelectorAll('.item');
const dots = document.querySelectorAll('.dot');
const numberIndicator = document.querySelector('.numbers');
const header = document.querySelector('header');

const productsGrid = document.querySelector('.products-grid');
const productsPrevButton = document.getElementById('products-prev');
const productsNextButton = document.getElementById('products-next');
const productCardWidth = 300;
const productCards = document.querySelectorAll('.product-card');

const hamburgerMenu = document.querySelector('.hamburger-menu');
const desktopNav = document.querySelector('.desktop-nav');

let active = 0;
const total = items.length;
let timer;

document.addEventListener('DOMContentLoaded', () => {
    if (header) {
        header.classList.add('header-loaded');
    }

    if (items.length > 0) {
        items[active].classList.add('active');
        dots[active].classList.add('active');
    }

    function update(direction) {
        // CORREÇÃO: Remove as classes de transição de todos os itens antes de adicionar as novas.
        items.forEach(item => item.classList.remove('item-next', 'item-prev'));

        const currentActiveItem = document.querySelector('.item.active');
        const currentActiveDot = document.querySelector('.dot.active');

        currentActiveItem.classList.remove('active');
        currentActiveDot.classList.remove('active');

        let oldActive = active;

        if (direction > 0) {
            active = (active + 1) % total;
        } else {
            active = (active - 1 + total) % total;
        }

        items[active].classList.add('active');
        dots[active].classList.add('active');
        if (numberIndicator) {
             numberIndicator.querySelector('.current-number').textContent = active + 1;
        }

        if (direction > 0) {
            items[oldActive].classList.add('item-prev');
            items[active].classList.add('item-next');
        } else {
            items[oldActive].classList.add('item-next');
            items[active].classList.add('item-prev');
        }

        resetTimer();
    }

    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            update(1);
        }, 5000);
    }

    if (prevButton) prevButton.addEventListener('click', () => {
        update(-1);
    });

    if (nextButton) nextButton.addEventListener('click', () => {
        update(1);
    });

    if (dots) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (index !== active) {
                    const direction = index > active ? 1 : -1;
                    active = index;
                    update(direction);
                }
            });
        });
    }

    if (items.length > 0) {
        resetTimer();
    }

    if (productsNextButton) {
        productsNextButton.addEventListener('click', () => {
            productsGrid.scrollBy({ left: productCardWidth + 20, behavior: 'smooth' });
        });
    }

    if (productsPrevButton) {
        productsPrevButton.addEventListener('click', () => {
            productsGrid.scrollBy({ left: -(productCardWidth + 20), behavior: 'smooth' });
        });
    }

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            desktopNav.classList.toggle('active');
        });
    }

    const closeMenu = () => {
        if (hamburgerMenu && hamburgerMenu.classList.contains('active')) {
            hamburgerMenu.classList.remove('active');
            desktopNav.classList.remove('active');
        }
    };
    if (desktopNav) {
        desktopNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Lógica do Carrinho
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsList = document.querySelector('.cart-items-list');
    const cartCountElement = document.getElementById('cart-count');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutButton = document.querySelector('.checkout-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    }

    function renderCart() {
        if (!cartItemsList) return;
        cartItemsList.innerHTML = '';
        let subtotal = 0;
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Preço: R$ ${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-from-cart-btn" data-id="${item.id}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            cartItemsList.appendChild(itemElement);
            subtotal += item.price * item.quantity;
        });

        if (subtotalElement) {
            subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        }
        if (totalElement) {
            // Assumindo frete grátis
            totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        }
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        saveCart();
        updateCartCount();
    }

    function handleCartItemChange(id, change) {
        const item = cart.find(cartItem => cartItem.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(cartItem => cartItem.id !== id);
            }
            saveCart();
            renderCart();
            updateCartCount();
        }
    }

    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const item = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseFloat(button.dataset.price),
                    image: button.dataset.image
                };
                addToCart(item);
            });
        });
    }

    if (cartItemsList) {
        cartItemsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-plus')) {
                const id = e.target.dataset.id;
                handleCartItemChange(id, 1);
            } else if (e.target.classList.contains('quantity-minus')) {
                const id = e.target.dataset.id;
                handleCartItemChange(id, -1);
            } else if (e.target.classList.contains('remove-from-cart-btn') || e.target.closest('.remove-from-cart-btn')) {
                const id = e.target.closest('.remove-from-cart-btn').dataset.id;
                cart = cart.filter(item => item.id !== id);
                saveCart();
                renderCart();
                updateCartCount();
            }
        });
    }
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            alert('Funcionalidade de finalização de compra não implementada. Carrinho limpo.');
            cart = [];
            saveCart();
            renderCart();
            updateCartCount();
        });
    }

    updateCartCount();
    renderCart();

    // particles.js
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#FF69B4"
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 0.5,
                "random": false
            },
            "size": {
                "value": 3,
                "random": true
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#FF69B4",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 6,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "repulse": {
                    "distance": 100,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                }
            }
        },
        "retina_detect": true
    });
});