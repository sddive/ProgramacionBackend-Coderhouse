function addtoCart(productId) {
    const cartId = '657128616f2822768850acd1'
    const url = `http://localhost:8080/api/carts/${cartId}/product/${productId}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data)
      alert('Producto añadido al carrito')
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}