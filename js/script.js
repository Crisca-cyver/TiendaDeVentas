document.addEventListener('DOMContentLoaded', () => {
    class Product {
        constructor(id, title, description, image, price) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.image = image;
            this.price = price;
        }
    }

    class Cart {
        constructor() {
            this.items = JSON.parse(localStorage.getItem('cart')) || [];
        }

        addItem(product, quantity) {
            const cartItem = this.items.find(item => item.id === product.id);
            if (cartItem) {
                cartItem.quantity += quantity;
            } else {
                this.items.push({ ...product, quantity });
            }
            this.save();
        }

        removeItem(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.save();
        }

        clear() {
            this.items = [];
            this.save();
        }

        save() {
            localStorage.setItem('cart', JSON.stringify(this.items));
        }

        getTotalPrice() {
            return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
        }

        render() {
            const cartContainer = document.getElementById('cart');
            const totalPriceElement = document.getElementById('total-price').querySelector('h5');
            cartContainer.innerHTML = '';
            this.items.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <h5>${item.title}</h5>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Precio: $${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="btn btn-danger btn-sm remove-from-cart" data-product-id="${item.id}">Borrar</button>
                `;
                cartContainer.appendChild(cartItem);
            });

            totalPriceElement.innerHTML = `Total: $${this.getTotalPrice().toFixed(2)}`;

            // Añadir evento a los botones de borrar del carrito
            document.querySelectorAll('.remove-from-cart').forEach(button => {
                button.addEventListener('click', () => {
                    const productId = parseInt(button.dataset.productId);
                    this.removeItem(productId);
                    this.render();
                });
            });
        }
    }

    const products = [
        new Product(1, 'Ala', 'Jabón en polvo x 10kg', 'ala.PNG', 10.00),
        new Product(2, 'Alcohol', 'Alcohol desinfectante x 1lt', 'alcohol.PNG', 5.00),
        new Product(3, 'Confort', 'Suavizante para la ropa x 3lt', 'confort.PNG', 7.50),
        new Product(4, 'Escobillón', 'Escoba primera marca x 40cm', 'escobillon.PNG', 3.00),
        new Product(5, 'Head & Shoulders', 'Shampoo y acondicionador x 375ml', 'headshoulder.PNG', 12.00),
        new Product(6, 'Higienol', 'Papel higiénico higienol x 30mts', 'higienol.PNG', 4.50),
        new Product(7, 'Lavandina', 'Blanqueador y desinfectante lavandina x 4lt', 'lavandina.PNG', 2.50),
        new Product(8, 'Limpiador', 'Líquido limpiador para piso x 1.8lt', 'limpiador.PNG', 6.00),
        new Product(9, 'Limpiador Odex', 'Limpiador potente para desengrasar x 400gr', 'limpiadorodex.PNG', 6.50),
        new Product(10, 'Lustramuebles', 'Producto para lustrar muebles x 360cc', 'lustramuebles.PNG', 8.00),
        new Product(11, 'Magistral', 'Detergente para platos magistral x 750ml', 'magistral.PNG', 9.00),
        new Product(12, 'Rollo de Cocina', 'Papel absorbente para cocina x 200 paños', 'rollococina.PNG', 1.50),
        new Product(13, 'Skip', 'Jabón líquido para lavar ropa diluir x 500ml', 'skip.PNG', 11.00),
    ];

    const productCardsContainer = document.getElementById('product-cards');
    const clearCartButton = document.getElementById('clear-cart');
    const cart = new Cart();

    // Cargar productos
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-4');
        productCard.innerHTML = `
            <div class="card">
                <img src="img/${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">Precio: $${product.price.toFixed(2)}</p>
                    <input type="number" class="form-control mb-2" placeholder="Cantidad" min="1" id="quantity-${product.id}">
                    <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Añadir al Carrito</button>
                </div>
            </div>
        `;
        productCardsContainer.appendChild(productCard);
    });

    // Añadir evento a los botones de añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.productId);
            const quantityInput = document.getElementById(`quantity-${productId}`);
            const quantity = parseInt(quantityInput.value);
            if (quantity > 0) {
                const product = products.find(p => p.id === productId);
                cart.addItem(product, quantity);
                cart.render();
                quantityInput.value = ''; // Limpiar el valor del input
            }
        });
    });

    // Vaciar carrito
    clearCartButton.addEventListener('click', () => {
        cart.clear();
        cart.render();
    });

    // Renderizar el carrito al cargar la página
    cart.render();
});