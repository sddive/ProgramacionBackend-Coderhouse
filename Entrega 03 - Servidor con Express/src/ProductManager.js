import * as fs from 'fs';

export default class ProductManager{

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

    async getProducts(){
        try {
            if (fs.existsSync(this.path)){
                return JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
            } else {
                return []
            }
        } catch (error) {
            throw new Error("Error: " + error.message)        
        }
    }

    async addProduct(newProduct){
        try {
            let products = await this.getProducts()
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
                    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
                }
        } catch (error) {
            throw new Error("Error: " + error.message)  
        }
    }

    async getProductById(id){
        try {
            let products =  await this.getProducts()
            let productById = products.find(product=>product.id===id)
            if(!productById){
                return {}
            }
            return productById
        } catch (error) {
            throw new Error("Error: " + error.message)  
        }
    }

    async updateProduct(id, object){
        try {
            let products = await this.getProducts()
            let index = products.findIndex(p=>p.id===id)
            if(index===-1){
                console.log("Product does not exist")
                return 
            }
            
            if (this.#validProduct(object)){
                products[index] = {
                    ...products[index],
                    ...object
                }
                const productsByCode = products.filter(p=>p.code===products[index].code)
                if (productsByCode.length>1){
                    console.log("The code already exists")
                }else{
                    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
                }            
            }
        } catch (error) {
            throw new Error("Error: " + error.message)  
        }
    }

    async deleteProduct(id){
        try {
            let products = await this.getProducts()
            let index = products.findIndex(p=>p.id===id)
            if(index===-1){
                console.log("Product does not exist")
                return 
            }
            products.splice(index, 1) 
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))          
        } catch (error) {
            throw new Error("Error: " + error.message)  
        }
    }
}