# Proyecto de Carrito de Compras

## Descripción

Este proyecto es una aplicación de carrito de compras simple que permite a los usuarios agregar productos a su carrito y ver el contenido del mismo. La aplicación está construida utilizando **Node.js** y JavaScript, lo que permite una experiencia fluida y rápida en el lado del servidor.

## Características

1. **Agregar Productos al Carrito**:

   - Los usuarios pueden agregar productos al carrito especificando la cantidad deseada.
   - Si el producto ya existe en el carrito, la cantidad se incrementará.

2. **Visualización del Carrito**:

   - Los usuarios pueden ver una lista de productos en su carrito, incluyendo el nombre del producto, la cantidad y el precio total.

3. **Persistencia del Carrito**:

   - El contenido del carrito se guarda en `localStorage`, por lo que los usuarios no perderán su carrito al recargar la página.

4. **Borrar Valor del Input**:

   - Al hacer clic en el botón de agregar, el valor dentro del input de cantidad se borra automáticamente.

5. **Interacción Mejorada con SweetAlert**:

   - Se utiliza **SweetAlert** para mostrar alertas personalizadas al agregar productos al carrito, confirmar eliminaciones y notificar al usuario sobre acciones exitosas.

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 14 o superior)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Crisca-cyver/TiendaDeVentas.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd TiendaDeVentas
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Abre `index.html` en tu navegador.

## Uso

1. Selecciona la cantidad de un producto que deseas agregar.
2. Haz clic en el botón "Agregar al Carrito".
3. El producto se añadirá al carrito y el valor del input se borrará automáticamente.
4. Puedes ver el contenido del carrito en la sección correspondiente.
5. Para finalizar la compra, haz clic en el botón "Finalizar Compra". Se mostrará un resumen de los productos en el carrito y el total. Confirma la compra para limpiar el carrito y recibir un mensaje de agradecimiento.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.
