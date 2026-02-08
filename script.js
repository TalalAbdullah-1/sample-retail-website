// Cart functionality
let cart = [];

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    updateCart();
    showNotification('Added to cart! ✨');
}

function removeFromCart(index) {
    const item = cart[index];
    cart.splice(index, 1);
    updateCart();
    showNotification(`${item.name} removed from cart`);
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = 'PKR ' + total.toLocaleString('en-PK');

    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>PKR ${item.price.toLocaleString('en-PK')}</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <i class="fas fa-times cart-item-remove" onclick="removeFromCart(${index})"></i>
            </div>
        `).join('');
    }

    // Save cart to localStorage
    localStorage.setItem('forsureee_cart', JSON.stringify(cart));
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');

    if (cartSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Search functionality
function searchProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    const products = document.querySelectorAll('.product-card');

    if (searchInput === '') {
        products.forEach(product => product.style.display = 'block');
        return;
    }

    let foundCount = 0;

    products.forEach(product => {
        const productName = product.getAttribute('data-name').toLowerCase();
        if (productName.includes(searchInput)) {
            product.style.display = 'block';
            foundCount++;
        } else {
            product.style.display = 'none';
        }
    });

    if (foundCount === 0) {
        showNotification('No products found matching your search');
    } else {
        showNotification(`Found ${foundCount} product${foundCount > 1 ? 's' : ''}`);
    }
}

// Allow search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchProducts();
            }
        });

        // Clear search
        searchInput.addEventListener('input', function() {
            if (this.value === '') {
                const products = document.querySelectorAll('.product-card');
                products.forEach(product => product.style.display = 'block');
            }
        });
    }
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.main-nav');
    if (navMenu.style.display === 'block') {
        navMenu.style.display = 'none';
    } else {
        navMenu.style.display = 'block';
    }
}

// Notification system
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #4A7C59, #2C5F2D);
        color: white;
        padding: 18px 28px;
        border-radius: 8px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 500;
        font-size: 14px;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Newsletter form
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;

            if (email) {
                showNotification('Thank you for subscribing! Welcome to FORSUREEE ✨');
                emailInput.value = '';
            }
        });
    }
});

// Load cart from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('forsureee_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .category-card, .trust-item').forEach(el => {
        observer.observe(el);
    });
});

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');

    if (cartSidebar && cartSidebar.classList.contains('active')) {
        if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
            toggleCart();
        }
    }
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add to wishlist functionality
document.querySelectorAll('.add-wishlist').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.style.color = '#D4AF37';
            showNotification('Added to wishlist ❤️');
        } else {
            this.style.color = '';
            showNotification('Removed from wishlist');
        }
    });
});

// Quick view functionality
document.querySelectorAll('.quick-view').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        showNotification('Quick view coming soon!');
    });
});

// Checkout button
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty! Add some items first.');
            } else {
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                showNotification(`Proceeding to checkout with ${cart.length} item(s). Total: PKR ${total.toLocaleString('en-PK')}`);
                // Here you would normally redirect to checkout page
            }
        });
    }
});

// CTA button functionality
document.addEventListener('DOMContentLoaded', function() {
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            document.querySelector('.products').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
});

// Logo click to go home
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo a');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// Prevent body scroll when cart is open
document.addEventListener('DOMContentLoaded', function() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (cartSidebar.classList.contains('active')) {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = '';
                    }
                }
            });
        });

        observer.observe(cartSidebar, { attributes: true });
    }
});

console.log('FORSUREEE - Timeless Elegance ✨');
console.log('Website loaded successfully!');