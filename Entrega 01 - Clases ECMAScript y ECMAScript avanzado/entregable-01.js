class ProductManager{

    constructor(){
        this.products = []
    }

    addProduct(title, description, price, thumbnail, code, stock){
        let productByCode = this.products.find(product=>product.code===code)
        if(productByCode){
            console.log("The code already exists")
            return
        }

        if (
            typeof title === "string" &&
            typeof description === "string" && 
            typeof price === "number" && 
            typeof thumbnail === "string" &&
            typeof code === "string" &&
            typeof stock === "number" &&
            title !== "" &&
            description !== "" &&
            thumbnail !== ""
        )
            {
                let id = 1
                if(this.products.length>0){
                    id=this.products[this.products.length-1].id + 1
                }
        
                let newProduct = {
                    id, title, description, 
                    price, thumbnail, code, stock
                }
        
                this.products.push(newProduct)            

            }
    }

    getProducts(){
        return this.products
    }

    getProductById(id){
        let product = this.products.find(product=>product.id===id)
        if(!product){
            console.log('Not found')
            return
        }
        return product
    }
}

let productManager = new ProductManager()
console.log(productManager.getProducts())
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25) // agrega con id = 1
console.log(productManager.getProducts())
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25) // error mismo codigo
productManager.addProduct("producto prueba 2", "Este es un producto prueba 2", 200, "Sin imagen", "abc1234", 25) // agrega con id = 2
console.log(productManager.getProducts())
console.log(productManager.getProductById(1))
console.log(productManager.getProductById(2))
console.log(productManager.getProductById(50)) // Not found