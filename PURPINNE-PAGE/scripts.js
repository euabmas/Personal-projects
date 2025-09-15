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
        items.forEach(item => item.classList.remove('item-next', 'item-prev'));

        const currentActiveItem = document.querySelector('.item.active');
        const currentActiveDot = document.querySelector('.dot.active');

        currentActiveItem.classList.remove('active');
        currentActiveDot.classList.remove('active');

        let oldActive = active;

        if (direction === 'next') {
            active = (active + 1) % total;
        } else if (direction === 'prev') {
            active = (active - 1 + total) % total;
        }

        items[active].classList.add('active');
        dots[active].classList.add('active');

        currentActiveItem.classList.add(`item-${direction}`);
        items[active].classList.add(`item-${direction}-active`);

        numberIndicator.querySelector('.current-number').textContent = active + 1;

        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            currentActiveItem.classList.remove(`item-${direction}`);
            items[active].classList.remove(`item-${direction}-active`);
        }, 800);
    }

    if (nextButton) {
        nextButton.onclick = () => update('next');
    }

    if (prevButton) {
        prevButton.onclick = () => update('prev');
    }

    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (index > active) {
                    update('next');
                } else if (index < active) {
                    update('prev');
                }
            });
        });
    }
    function autoSlide() {
        update('next');
        timer = setTimeout(autoSlide, 5000);
    }

    // Iniciar o carrossel automático
    timer = setTimeout(autoSlide, 5000);

    // Modificar as funções de clique para reiniciar o temporizador
    if (nextButton) {
        nextButton.onclick = () => {
            clearTimeout(timer);
            update('next');
            timer = setTimeout(autoSlide, 5000);
        };
    }

    if (prevButton) {
        prevButton.onclick = () => {
            clearTimeout(timer);
            update('prev');
            timer = setTimeout(autoSlide, 5000);
        };
    }

    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearTimeout(timer);
                if (index > active) {
                    update('next');
                } else if (index < active) {
                    update('prev');
                }
                timer = setTimeout(autoSlide, 5000);
            });
        });
    }

    // ... o restante do seu código (Products grid, hamburger menu, etc.)
});

// Products grid functionality
if (productsGrid) {
    let scrollPosition = 0;

    productsNextButton.onclick = () => {
        const maxScroll = productsGrid.scrollWidth - productsGrid.clientWidth;
        scrollPosition += productCardWidth + 20; // 20px de gap
        if (scrollPosition > maxScroll) {
            scrollPosition = maxScroll;
        }
        productsGrid.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    };

    productsPrevButton.onclick = () => {
        scrollPosition -= productCardWidth + 20;
        if (scrollPosition < 0) {
            scrollPosition = 0;
        }
        productsGrid.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    };
}

// Hamburger menu functionality
if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
        desktopNav.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });
}

// Lógica do Carrinho
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
                    ${item.size ? `<p>Tamanho: ${item.size}</p>` : ''}
                    <div class="quantity-controls">
                        <button class="quantity-minus" data-id="${item.id}" data-size="${item.size}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-plus" data-id="${item.id}" data-size="${item.size}">+</button>
                    </div>
                </div>
                <button class="remove-from-cart-btn" data-id="${item.id}" data-size="${item.size}">
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
        totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    }
}

function addToCart(item, quantity) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.size === item.size);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...item, quantity: quantity });
    }
    saveCart();
    updateCartCount();
    renderCart();
}

function handleCartItemChange(id, size, change) {
    const item = cart.find(cartItem => cartItem.id === id && cartItem.size === size);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.id !== id || cartItem.size !== size);
        }
        saveCart();
        renderCart();
        updateCartCount();
    }
}

// NEW: Functionality for size selection and add-to-cart button
const productCardsInGrid = document.querySelectorAll('.products-grid .product-card');
productCardsInGrid.forEach(productCard => {
    const sizeBoxes = productCard.querySelectorAll('.size-box');
    sizeBoxes.forEach(sizeBox => {
        sizeBox.addEventListener('click', () => {
            // Remove 'active' class from all size boxes in the same product card
            productCard.querySelectorAll('.size-box').forEach(box => {
                box.classList.remove('active');
            });

            // Add 'active' class to the clicked size box
            sizeBox.classList.add('active');

            // Show the quantity and add-to-cart button for this product card
            const quantityContainer = productCard.querySelector('.quantity-container');
            const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
            quantityContainer.classList.remove('hidden');
            addToCartBtn.classList.remove('hidden');
        });
    });

    const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedSizeElement = productCard.querySelector('.size-box.active');

            if (!selectedSizeElement) {
                alert('Por favor, selecione um tamanho antes de adicionar ao carrinho.');
                return;
            }

            const productId = addToCartBtn.getAttribute('data-id');
            const productName = addToCartBtn.getAttribute('data-name');
            const productPrice = parseFloat(addToCartBtn.getAttribute('data-price'));
            const productImage = addToCartBtn.getAttribute('data-image');
            const quantityInput = productCard.querySelector('input[type="number"]');
            const quantity = parseInt(quantityInput.value);
            const selectedSize = selectedSizeElement.getAttribute('data-size');

            const item = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                size: selectedSize
            };

            addToCart(item, quantity);
        });
    }
});


if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-plus')) {
            const { id, size } = e.target.dataset;
            handleCartItemChange(id, size, 1);
        } else if (e.target.classList.contains('quantity-minus')) {
            const { id, size } = e.target.dataset;
            handleCartItemChange(id, size, -1);
        } else if (e.target.classList.contains('remove-from-cart-btn') || e.target.closest('.remove-from-cart-btn')) {
            const removeButton = e.target.closest('.remove-from-cart-btn');
            const { id, size } = removeButton.dataset;
            cart = cart.filter(item => !(item.id === id || item.size === size));
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
if (window.particlesJS) {
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
        }
    });
}