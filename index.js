/* document.addEventListener('DOMContentLoaded', () => {

    const productList = document.getElementById('product-list');
    const cartList = document.getElementById('cart-list');
    const cart = [];

    // Função para buscar produtos e exibi-los
    function fetchProducts() {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                displayProducts(data);
            })
            .catch(error => console.error('Erro:', error));
    }

    // Função para exibir produtos
    function displayProducts(products) {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p>Preço: $${product.price}</p>
                <img src="${product.image}" alt="${product.title}" />
                <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            `;
            productList.appendChild(productElement);
        });
    }

    // Função para adicionar produtos ao carrinho
    window.addToCart = function(productId) {
        fetch(`https://fakestoreapi.com/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                cart.push(product);
                updateCart();
            })
            .catch(error => console.error('Erro:', error));
    };

    // Função para atualizar a exibição do carrinho
    function updateCart() {
        cartList.innerHTML = '';

        cart.forEach(product => {
            const cartItem = document.createElement('li');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                ${product.title} - $${product.price}
                <button onclick="removeFromCart(${product.id})">Remover</button>
            `;
            cartList.appendChild(cartItem);
        });
    }

    // Função para remover produtos do carrinho
    window.removeFromCart = function(productId) {
        const index = cart.findIndex(product => product.id === productId);
        if (index !== -1) {
            cart.splice(index, 1);
            updateCart();
        }
    };

    // Buscar produtos ao carregar a página
    fetchProducts();
}); */

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const modalCartList = document.getElementById('modal-cart-list');
    const closeModalButton = document.querySelector('.modal .close');

    let cart = [];

    function fetchProducts() {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                displayProducts(data);
            })
            .catch(error => console.error('Erro:', error));
    }


    function displayProducts(products) {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}" />
                <h2>${product.title}</h2>
                <p class="description">${product.description}</p>
                <p class="price">Preço: $${product.price}</p>
                <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            `;
            productList.appendChild(productElement);
        });
    }

    window.addToCart = function(productId) {
        fetch(`https://fakestoreapi.com/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                if (!cart.some(item => item.id === productId)) {
                    cart.push(product);
                    updateCartCount();
                }
            })
            .catch(error => console.error('Erro:', error));
    };

    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    function updateCartModal() {
        modalCartList.innerHTML = '';

        cart.forEach(product => {
            const cartItem = document.createElement('li');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                ${product.title} - $${product.price}
                <button onclick="removeFromCart(${product.id})">Remover</button>
            `;
            modalCartList.appendChild(cartItem);
        });
    }

    window.removeFromCart = function(productId) {
        const index = cart.findIndex(product => product.id === productId);
        if (index !== -1) {
            cart.splice(index, 1);
            updateCartCount();
            updateCartModal();
        }
    };


    document.getElementById('cart-icon').addEventListener('click', () => {
        updateCartModal();
        cartModal.style.display = 'block';
    });

  
    closeModalButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    fetchProducts();
});

