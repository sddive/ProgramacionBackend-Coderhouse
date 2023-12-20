import mongoose from 'mongoose';
import { productModel } from "./models/product.model.js";

try {
    await mongoose.connect('mongodb+srv://sergiodivenutoq:Coder23.@codersdivenuto.mlve65q.mongodb.net/?retryWrites=true&w=majority', {dbname:'ecommerce'})
    console.log('DB Online...!!!')
} catch (error) {
    console.log(error)
}

const productos = [
    {
      title: "Camisa a Rayas",
      description: "Camisa informal para cualquier ocasión",
      price: 39.99,
      thumbnail: ["imagen1.jpg", "imagen1_2.jpg", "imagen1_3.jpg"],
      code: "abd123",
      status: true,
      stock: 10,
      category: "Moda"
    },
    {
      title: "Vestido de Noche",
      description: "Elegante vestido para ocasiones especiales",
      price: 79.99,
      thumbnail: ["imagen2.jpg", "imagen2_2.jpg"],
      code: "def456",
      status: false,
      stock: 5,
      category: "Moda"
    },
    {
      title: "Zapatos Deportivos",
      description: "Zapatos cómodos para correr",
      price: 59.99,
      thumbnail: ["imagen3.jpg", "imagen3_2.jpg"],
      code: "ghi789",
      status: true,
      stock: 8,
      category: "Calzado"
    },
    {
      title: "Teléfono Inteligente",
      description: "Tecnología avanzada en tu mano",
      price: 499.99,
      thumbnail: ["imagen4.jpg"],
      code: "jkl012",
      status: true,
      stock: 12,
      category: "Electrónicos"
    },
    {
      title: "Laptop Ultradelgada",
      description: "Potencia y portabilidad en un mismo dispositivo",
      price: 899.99,
      thumbnail: ["imagen5.jpg"],
      code: "mno345",
      status: true,
      stock: 20,
      category: "Electrónicos"
    },
    {
      title: "Cámara Fotográfica Profesional",
      description: "Captura momentos con la mejor calidad",
      price: 1299.99,
      thumbnail: ["imagen6.jpg", "imagen6_2.jpg"],
      code: "pqr678",
      status: true,
      stock: 15,
      category: "Electrónicos"
    },
    {
      title: "Bolso de Cuero",
      description: "Bolso elegante y duradero",
      price: 89.99,
      thumbnail: ["imagen7.jpg"],
      code: "stu901",
      status: true,
      stock: 18,
      category: "Moda"
    },
    {
      title: "Gafas de Sol",
      description: "Estilo y protección para tus ojos",
      price: 29.99,
      thumbnail: ["imagen8.jpg"],
      code: "vwx234",
      status: true,
      stock: 25,
      category: "Accesorios"
    },
    {
      title: "Reloj de Pulsera",
      description: "Elegancia y precisión en tu muñeca",
      price: 99.99,
      thumbnail: ["imagen9.jpg"],
      code: "yza567",
      status: true,
      stock: 30,
      category: "Accesorios"
    },
    {
      title: "Billetera de Cuero",
      description: "Billetera clásica y resistente",
      price: 49.99,
      thumbnail: ["imagen10.jpg"],
      code: "bcd890",
      status: true,
      stock: 22,
      category: "Accesorios"
    },
    {
      title: "Botines de Moda",
      description: "Botines elegantes para toda ocasión",
      price: 69.99,
      thumbnail: ["imagen11.jpg"],
      code: "efg123",
      status: true,
      stock: 14,
      category: "Calzado"
    },
    {
      title: "Jeans Clásicos",
      description: "Jeans cómodos y a la moda",
      price: 49.99,
      thumbnail: ["imagen12.jpg"],
      code: "hij456",
      status: true,
      stock: 16,
      category: "Moda"
    },
    {
      title: "Mochila Deportiva",
      description: "Mochila resistente para actividades al aire libre",
      price: 39.99,
      thumbnail: ["imagen13.jpg"],
      code: "klm789",
      status: true,
      stock: 20,
      category: "Accesorios"
    },
    {
      title: "Chaquetón de Invierno",
      description: "Chaquetón abrigado y elegante",
      price: 149.99,
      thumbnail: ["imagen14.jpg"],
      code: "nop012",
      status: true,
      stock: 10,
      category: "Moda"
    },
    {
      title: "Maletín Ejecutivo",
      description: "Maletín profesional para tus negocios",
      price: 79.99,
      thumbnail: ["imagen15.jpg"],
      code: "qrs345",
      status: true,
      stock: 8,
      category: "Accesorios"
    }
  ]

  const result = await productModel.insertMany(productos)