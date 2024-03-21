const socket = io()
let divProducts=document.getElementById('products')

socket.emit('getProducts')

socket.on('allProducts', products=>{
    console.log('Carga inicial de todos los productos')
    divProducts.innerHTML = ''
    products.forEach(product=>{
        let parrafo = document.createElement('p')
        parrafo.setAttribute('id', product.id)
        parrafo.innerHTML = `<strong>${product.title}</strong>`
        divProducts.append(parrafo)
        divProducts.scrollTop = divProducts.scrollHeight
    })
})

socket.on('newProduct', product=>{
    console.log('Nuevo producto')
    let parrafo = document.createElement('p')
    parrafo.setAttribute('id', product.id)
    parrafo.innerHTML = `<strong>${product.title}</strong>`
    divProducts.append(parrafo)
    divProducts.scrollTop = divProducts.scrollHeight   
})

socket.on('deleteProduct', product=>{
    console.log('Eliminar producto')
    const id = String(product.id)
    console.log(id)
    const element = document.getElementById(id)
    element.remove()
    divProducts.scrollTop = divProducts.scrollHeight   
})