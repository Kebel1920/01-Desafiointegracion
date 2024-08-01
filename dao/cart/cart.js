document.addEventListener('DOMContentLoaded', async () => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      document.getElementById('cart-list').innerHTML = '<li>No hay productos en el carrito</li>';
      return;
    }
  
    const response = await fetch(`/api/cart/${cartId}`);
    const cart = await response.json();
  
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = cart.products.map(product => `
      <li>
        <h2>${product.name}</h2>
        <p>${product.price}</p>
        <button data-product-id="${product._id}" class="remove-from-cart">Eliminar del Carrito</button>
      </li>
    `).join('');
  
    document.querySelectorAll('.remove-from-cart').forEach(button => {
      button.addEventListener('click', async () => {
        const productId = button.getAttribute('data-product-id');
        await fetch(`/api/cart/${cartId}/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        location.reload(); // Recargar la página para mostrar los cambios
      });
    });
  
    document.getElementById('checkout-button').addEventListener('click', async () => {
      const userEmail = prompt('Por favor ingresa tu correo electrónico:');
      if (userEmail) {
        const response = await fetch(`/api/cart/${cartId}/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail })
        });
  
        if (response.ok) {
          alert('Pago realizado');
          localStorage.removeItem('cartId');
          location.reload();
        } else {
          alert('Error al realizar el pago');
        }
      }
    });
  });
  