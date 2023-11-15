import * as fs from 'fs';

export default class ProductManager{

    #keysAndTypesValid;

    constructor(path){
        this.path = path
        this.#keysAndTypesValid = {
            title: 'string', 
            description: 'string', 
            price: 'number', 
            thumbnail: 'string',  
            code: 'string',  
            status: 'boolean', 
            stock: 'number', 
            category: 'string', 
        }
    }

    #validProduct(newProduct) {
        const keysValid = Object.keys(this.#keysAndTypesValid)
        let keys = Object.keys(newProduct)
        for(let i=0; i < keys.length; i++){
            if (!keysValid.includes(keys[i])){
                console.log('Keys not invalid')
                return false
            }
            const key = keys[i]
            const value = newProduct[key]
            if (value.length === 0){
                console.log('Values empty')
                return false
            }
            if (typeof value !== this.#keysAndTypesValid[key]){
                console.log('Format invalid')
                return false
            }
        }
        return true
    }

    async getProducts(){
        try {
            if (fs.existsSync(this.path)){
                return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            } else {
                return []
            }
        } catch (error) {
            throw new Error(error.message)        
        }
    }

    async getProductById(id){
        try {
            let products =  await this.getProducts()
            let productById = products.find(product=>product.id===id)
            if(!productById){
                return { error: 'Product not found' }
            }
            return productById
        } catch (error) {
            throw new Error(error.message)  
        }
    }

    async addProduct(newProduct){
        try {
            let products = await this.getProducts()
            let productByCode = products.find(product=>product.code===newProduct.code)
            if(productByCode){
                console.log('The code already exists')
                return {error: 'The code already exists'}
            }
            
            const keys = Object.keys(this.#keysAndTypesValid)
            for(const i in keys){
                if (!newProduct.hasOwnProperty(keys[i])) {
                    console.log(`The key '${keys[i]}' not found.`)
                    return {error: `The key '${keys[i]}' not found.`}
                }                                                                         
            }

            if (this.#validProduct(newProduct)){        
                let id = 1
                if(products.length>0){
                    id=products[products.length-1].id + 1
                }
        
                let p = {
                    id, ...newProduct
                }
        
                products.push(p)
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
                return p
                
            } else {
                return {error: 'Product not valid'}
            }            
        } catch (error) {
            throw new Error(error.message)  
        }
    }

    async updateProduct(id, object){
        try {
            let products = await this.getProducts()
            let index = products.findIndex(p=>p.id===id)
            if(index===-1){
                console.log('Product does not exist')
                return { error: 'Product not found' }
            }
            
            if (this.#validProduct(object)){
                products[index] = {
                    ...products[index],
                    ...object
                }
                const productsByCode = products.filter(p=>p.code===products[index].code)
                if (productsByCode.length>1){
                    console.log('The code already exists')
                    return {error: 'The code already exists'}
                }else{
                    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
                }            
            } else {
                return {error: 'Product not valid'}
            }
            console.log(products[index])
            return products[index]
        } catch (error) {
            throw new Error(error.message)  
        }
    }

    async deleteProduct(id){
        try {
            let products = await this.getProducts()
            let index = products.findIndex(p=>p.id===id)
            if(index===-1){
                console.log('Product does not exist')
                return {}
            }
            let product = products.splice(index, 1) 
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
            return product   
        } catch (error) {
            throw new Error(error.message)  
        }
    }
}