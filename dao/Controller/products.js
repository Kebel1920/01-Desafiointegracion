document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-to-cart');
  
    buttons.forEach(button => {
      button.addEventListener('click', async () => {
        const productId = button.getAttribute('data-product-id');
        let cartId = localStorage.getItem('cartId');
  
        if (!cartId) {
          // Crear un nuevo carrito si no existe
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          const newCart = await response.json();
          cartId = newCart._id;
          localStorage.setItem('cartId', cartId);
        }
  
        // Agregar producto al carrito
        const response = await fetch(`/api/cart/${cartId}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        });
  
        if (response.ok) {
          alert('Producto agregado al carrito');
        } else {
          alert('Error al agregar producto al carrito');
        }
      });
    });
  });
  