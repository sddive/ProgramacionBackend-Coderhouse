const socket = io()
let divProducts=document.getElementById('products')

socket.emit('id')

socket.on('getProduct', products=>{
    console.log('hola')
    divProducts.innerHTML = ''
    products.forEach(product=>{
        let parrafo=document.createElement('p')
        parrafo.innerHTML=`<strong>${product.title}</strong> precio: <i>${product.price}</i>`
        parrafo.classList.add('mensaje')
        let br=document.createElement('br')
        divProducts.append(parrafo, br)
        divProducts.scrollTop=divProducts.scrollHeight   
    })
})