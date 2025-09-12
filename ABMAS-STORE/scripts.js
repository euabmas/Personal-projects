const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const items = document.querySelectorAll('.item');
const dots = document.querySelectorAll('.dot');
const numberIndicator = document.querySelector('.numbers');
const header = document.querySelector('header');

// Novos elementos para o carrossel de produtos
const productsGrid = document.querySelector('.products-grid');
const productsPrevButton = document.getElementById('products-prev');
const productsNextButton = document.getElementById('products-next');
const productCardWidth = 300; // Largura aproximada de cada card (ajuste se necessário)
const productCards = document.querySelectorAll('.product-card');

let active = 0;
const total = items.length;
let timer;

document.addEventListener('DOMContentLoaded', () => {
    header.classList.add('header-loaded');

    // Inicialização do carrossel principal
    items[active].classList.add('active');
    dots[active].classList.add('active');

    function update(direction) {
        const currentActiveItem = document.querySelector('.item.active');
        const currentActiveDot = document.querySelector('.dot.active');

        currentActiveItem.classList.remove('active', 'item-next', 'item-prev');
        currentActiveDot.classList.remove('active');

        let oldActive = active;

        if (direction > 0) {
            active = (active + 1) % total;
            currentActiveItem.classList.add('item-prev');
        } else if (direction < 0) {
            active = (active - 1 + total) % total;
            currentActiveItem.classList.add('item-next');
        }

        items[active].classList.add('active');
        dots[active].classList.add('active');
        numberIndicator.textContent = String(active + 1).padStart(2, '0');

        setTimeout(() => {
            items[oldActive].classList.remove('item-prev', 'item-next');
        }, 700);
    }

    timer = setInterval(() => {
        update(1);
    }, 5000);

    prevButton.addEventListener('click', () => {
        clearInterval(timer);
        update(-1);
        timer = setInterval(() => {
            update(1);
        }, 5000);
    });

    nextButton.addEventListener('click', () => {
        clearInterval(timer);
        update(1);
        timer = setInterval(() => {
            update(1);
        }, 5000);
    });

    // Event listeners para os botões do grid de produtos
    productsNextButton.addEventListener('click', () => {
        productsGrid.scrollLeft += productCardWidth;
    });

    productsPrevButton.addEventListener('click', () => {
        productsGrid.scrollLeft -= productCardWidth;
    });

    // Novo código para o efeito de inclinação
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Para o efeito rodar apenas uma vez
            }
        });
    }, {
        threshold: 0.5 // Aciona quando 50% do elemento está visível
    });

    productCards.forEach(card => {
        observer.observe(card);
    });
});

// A inicialização do particles.js pode ficar fora do DOMContentLoaded
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#00f7ff"
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
            "color": "#00f7ff",
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