export const errorArgumentos=({...otros})=>{

    return `
Error en argumentos:
Argumentos obligatorios:
- title: String, 
- description: String, 
- price: Number, 
- code: String
- stock: Number, 
- category: String,    
- status: Boolean

Argumentos opcionales:
- deleted: Boolean
- thumbnail: [String]

Argumentos recibidos:
${JSON.stringify(otros)}`
}