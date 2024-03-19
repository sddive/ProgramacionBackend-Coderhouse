import {fakerES_MX as faker} from '@faker-js/faker'

export const generateProduct=()=>{
    const product = {
        code: faker.string.alphanumeric(2)+faker.string.numeric({length:6, allowLeadingZeros:true}),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({max: 200}),
        thumbnails: [faker.image.url(), faker.image.url()],
        stock: faker.number.int({ min: 10, max: 20 }),
        category: faker.commerce.department(),
        status: true,
        deleted: false
    }
    return product
}
