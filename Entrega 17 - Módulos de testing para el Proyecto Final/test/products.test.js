import { expect } from "chai"
import supertest from "supertest"
import { describe, it } from "mocha"
import mongoose from "mongoose"
import { config } from "../src/config/config.dotenv.js"

let cookie
let requester = supertest("http://localhost:8080")

await mongoose.connect(config.mongo_URL, {dbname:config.dbName})

describe("Testing Sergio Divenuto ECommerce", async function () {

    this.timeout(5000)

    describe("Testing products module", async function () {

        before(async () => {
            let user = {
                email: "test@test.com",
                password: "1234",
            }

            let login = await requester.post("/api/sessions/login").send(user)
            cookie = login.headers["set-cookie"][0]
        })

        after(async () => {
            await mongoose.connection.collection("products").deleteOne({ code: "testCode" });
        })

        it("Testing get product with id that does not exist", async function () {

            let testing = await requester.get("/api/products/123456")
                .set("Cookie", cookie)


            expect(testing.statusCode).to.be.equal(400)
            expect(testing.body.error).to.exist.and.to.be.equal("Ingrese un id válido...!!!")

        })


        it("Testing to create product", async function () {

            let product = {
                title: "test",
                description: "product test",
                status: false,
                category: "test",
                price: 150,
                code: "testCode",
                stock: 15
            }

            let testing = await requester.post("/api/products").send(product)
                .set("Cookie", cookie)

            let productDB = await mongoose.connection.collection("products").findOne({ code: "testCode" });

            expect(testing.statusCode).to.be.equal(200)
            expect(testing.body.message).to.exist.and.to.be.equal("product added successfully")
            expect(productDB).exist
            expect(productDB.code).to.be.equal("testCode")

        })

        it("Testing delete product", async function () {
            let productDB = await mongoose.connection.collection("products").findOne({ code: "testCode" })
            const id = productDB._id.toString()
            let testing = await requester.delete(`/api/products/${id}`)
                .set("Cookie", cookie)
            let updatedProduct = await mongoose.connection.collection("products").findOne({ code: "testCode" });

            expect(testing.statusCode).to.be.equal(200)
            expect(testing.body.message).to.exist.and.to.be.equal('product successfully removed')
            expect(updatedProduct.status).to.be.false

        })
    })


})