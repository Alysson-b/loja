document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const modalCartList = document.getElementById('modal-cart-list');
    const closeModalButtons = document.querySelectorAll('.modal .close');
    const searchBar = document.getElementById('search-bar');
    const checkoutButton = document.getElementById('checkout-button');
    const insertCepButton = document.getElementById('insert-cep-button');
    const cepModal = document.getElementById('cep-modal');
    const confirmAddressButton = document.getElementById('confirm-address-button');
    const cepInput = document.getElementById('cep-input');
    const addressInfo = document.getElementById('address-info');

    let products = [];
    let cart = [];
    let addressConfirmed = false;

    function fetchProducts() {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                products = data;
                displayProducts(data);
            })
            .catch(error => console.error('Erro:', error));
    }

    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}" />
                <h2>${product.title}</h2>
                <p class="description">${product.description}</p>
                <p class="price">Preço: $${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
            `;
            productList.appendChild(productElement);
        });

        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                addToCart(productId);
            });
        });
    }

    function filterProducts(query) {
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase())
        );
        displayProducts(filteredProducts);
    }

    searchBar.addEventListener('input', (event) => {
        filterProducts(event.target.value);
    });

    function addToCart(productId) {
        fetch(`https://fakestoreapi.com/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                if (!cart.some(item => item.id === productId)) {
                    cart.push(product);
                    updateCartCount();
                    updateCartModal();
                }
            })
            .catch(error => console.error('Erro:', error));
    }

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
                <button class="remove-from-cart" data-id="${product.id}">Remover</button>
            `;
            modalCartList.appendChild(cartItem);
        });

        insertCepButton.style.display = 'block';

        checkoutButton.style.display = addressConfirmed ? 'block' : 'none';
        
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                removeFromCart(productId);
            });
        });
    }

    function removeFromCart(productId) {
        const index = cart.findIndex(product => product.id === productId);
        if (index !== -1) {
            cart.splice(index, 1);
            updateCartCount();
            updateCartModal();
        }
    }

    function handleCheckout() {
        if (addressConfirmed) {
            alert('Compra finalizada! Obrigado pela sua compra.');
            cart = [];
            updateCartCount();
            updateCartModal();
            cartModal.style.display = 'none';
        } else {
            alert('Por favor, confirme o endereço antes de finalizar a compra.');
        }
    }

    function confirmAddress() {
        const cep = cepInput.value.trim();
        if (cep) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        addressInfo.textContent = 'CEP inválido.';
                    } else {
                        addressInfo.innerHTML = `
                            Endereço: ${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}
                        `;
                        addressConfirmed = true;
                        cepModal.style.display = 'none';
                        cartModal.style.display = 'block';
                        updateCartModal();  // Certificar que o botão "Finalizar Compra" é exibido
                    }
                })
                .catch(error => console.error('Erro:', error));
        } else {
            addressInfo.textContent = 'Por favor, insira um CEP.';
        }
    }

    document.getElementById('cart-icon').addEventListener('click', () => {
        updateCartModal();
        cartModal.style.display = 'block';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartModal.style.display = 'none';
            cepModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (event.target === cepModal) {
            cepModal.style.display = 'none';
        }
    });

    insertCepButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
        cepModal.style.display = 'block';
    });

    confirmAddressButton.addEventListener('click', confirmAddress);
    checkoutButton.addEventListener('click', handleCheckout);

    fetchProducts();
});
