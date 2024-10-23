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
                    <p>Cantidad: <button class="btn btn-sm btn-secondary decrease-quantity" data-product-id="${item.id}">-</button> 
                    ${item.quantity} 
                    <button class="btn btn-sm btn-secondary increase-quantity" data-product-id="${item.id}">+</button></p>
                    <p>Precio: $${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="btn btn-danger btn-sm remove-from-cart" data-product-id="${item.id}">Borrar</button>
                `;
                cartContainer.appendChild(cartItem);
            });

            totalPriceElement.innerHTML = `Total: $${this.getTotalPrice().toFixed(2)}`;

            // Añadir eventos a los botones de modificar cantidad
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', () => {
                    const productId = parseInt(button.dataset.productId);
                    this.changeQuantity(productId, 1);
                    this.render();
                });
            });

            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', () => {
                    const productId = parseInt(button.dataset.productId);
                    this.changeQuantity(productId, -1);
                    this.render();
                });
            });

            // Añadir evento a los botones de borrar del carrito
            document.querySelectorAll('.remove-from-cart').forEach(button => {
                button.addEventListener('click', () => {
                    const productId = parseInt(button.dataset.productId);
                    // Usar SweetAlert para confirmar la eliminación
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "¡Este producto será eliminado del carrito!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.removeItem(productId);
                            this.render();
                            Swal.fire('¡Eliminado!', 'El producto ha sido eliminado del carrito.', 'success');
                        }
                    });
                });
            });
        }

        changeQuantity(productId, change) {
            const cartItem = this.items.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity += change;
                if (cartItem.quantity <= 0) {
                    this.removeItem(productId);
                } else {
                    this.save();
                }
            }
        }
    }

    const cart = new Cart();
    const productCardsContainer = document.getElementById('product-cards');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.getElementById('checkout');

    // Cargar productos desde el archivo JSON
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const products = data.map(item => new Product(item.id, item.title, item.description, item.image, item.price));

            // Cargar productos en la interfaz
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
                        // Mostrar alerta de éxito
                        Swal.fire('¡Éxito!', 'Producto añadido al carrito.', 'success');
                    } else {
                        console.log('Cantidad no válida'); // Mensaje de error si la cantidad es 0 o negativa
                    }
                });
            });

            // Renderizar el carrito al cargar la página
            cart.render();
        })
        .catch(error => console.error('Error al cargar los productos:', error));

    // Vaciar carrito
    clearCartButton.addEventListener('click', () => {
        cart.clear();
        cart.render();
        Swal.fire('¡Carrito vaciado!', 'Todos los productos han sido eliminados.', 'success');
    });

    // Finalizar compra
    checkoutButton.addEventListener('click', () => {
        if (cart.items.length === 0) {
            Swal.fire('Carrito vacío', 'No hay productos en el carrito para finalizar la compra.', 'info');
            return;
        }

        const totalPrice = cart.getTotalPrice().toFixed(2);
        const itemsList = cart.items.map(item => `${item.title} (Cantidad: ${item.quantity})`).join('<br>');

        Swal.fire({
            title: 'Resumen de la Compra',
            html: `<strong>Productos:</strong><br>${itemsList}<br><strong>Total:</strong> $${totalPrice}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Confirmar Compra',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                cart.clear(); // Limpiar el carrito después de la compra
                cart.render();
                Swal.fire('¡Compra Confirmada!', 'Gracias por tu compra.', 'success');
            }
        });
    });
});
