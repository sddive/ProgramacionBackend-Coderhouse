const fs = require('fs')

class ProductManager{

    constructor(path){
        this.path = path
    }

    #validProduct(newProduct) {
        const keysValid = ["title", "description", "price", "thumbnail", "code", "stock"]
        let keys = Object.keys(newProduct)
        for(let i=0; i< keys.length; i++){
            if (!keysValid.includes(keys[i])){
                console.log('Format invalid')
                return false
            }
        } 
        return true;
    }

    getProducts(){
        if (fs.existsSync(this.path)){
            return JSON.parse(fs.readFileSync(this.path,"utf-8"))
        }else{
            return []
        }
    }

    addProduct(newProduct){
        let products = this.getProducts()
        let productByCode = products.find(product=>product.code===newProduct.code)
        if(productByCode){
            console.log("The code already exists")
            return
        }

        if (typeof newProduct.title === "string" &&
            typeof newProduct.description === "string" && 
            typeof newProduct.price === "number" && 
            typeof newProduct.thumbnail === "string" &&
            typeof newProduct.code === "string" &&
            typeof newProduct.stock === "number" &&
            newProduct.title !== "" &&
            newProduct.description !== "" &&
            newProduct.thumbnail !== "" && this.#validProduct(newProduct))
            {        
                let id = 1
                if(products.length>0){
                    id=products[products.length-1].id + 1
                }
        
                let p = {
                    id, ...newProduct
                }
        
                products.push(p)
                fs.writeFileSync(this.path, JSON.stringify(products, null, 5))
            }
    }

    getProductById(id){
        let products = this.getProducts()
        let productById = products.find(product=>product.id===id)
        if(!productById){
            console.log('Not found')
            return
        }
        return productById
    }

    updateProduct(id, object){
        let products = this.getProducts()
        let index = products.findIndex(p=>p.id===id)
        if(index===-1){
            console.log(`The product ${id} not exist`)
            return 
        }
        
        if (this.#validProduct(object)){
            products[index]={
                ...products[index],
                ...object
            }
            productsByCode = products.filter(p=>p.code===products[index].code)
            if (productsByCode.length()>1){
                console.log("The code already exists")
            }else{
                fs.writeFileSync(this.path, JSON.stringify(products, null, 5))
            }            
        }
    }

    deleteProduct(id){
        let products = this.getProducts()
        let index = products.findIndex(p=>p.id===id)
        if(index===-1){
            console.log(`The product ${id} not exist`)
            return 
        }
        products.splice(index, 1)
        fs.writeFileSync(this.path, JSON.stringify(products, null, 5))
    }
}


//TESTING

let productManager = new ProductManager("./products.txt")
console.log(productManager.getProducts())

let object = { 
    title: "producto prueba", 
    description:"Este es un producto prueba",
    price:200, 
    thumbnail:"Sin imagen",
    code:"abc123",
    stock:25,
}
productManager.addProduct(object) // agrega con id = 1
console.log(productManager.getProducts())

productManager.addProduct(object) // error mismo codigo

object.code = "abc12345" // le asigno otro código
productManager.addProduct(object) // agrega con id = 2
console.log(productManager.getProducts())

object.code = "abc1234567" // le asigno otro código
object.id = 5 // le asigno id al object
productManager.addProduct(object) // error no se puede asignar id

console.log(productManager.getProductById(1))
console.log(productManager.getProductById(2))
console.log(productManager.getProductById(50)) // Not found

productManager.updateProduct(2, {title:"producto prueba 2", description:"Este es un producto prueba 2"})
console.log(productManager.getProducts())

productManager.deleteProduct(2) // elimina el producto
console.log(productManager.getProducts())

productManager.deleteProduct(40) // error
console.log(productManager.getProducts())