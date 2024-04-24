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

    describe("Testing carts module", async function () {

        before(async () => {
            let user = {
                email: "test@test.com",
                password: "1234",
            }

            let login = await requester.post("/api/sessions/login").send(user)
            cookie = login.headers["set-cookie"][0]
        })


        it("Testing add product to cart", async function () {
            let testing = await requester.post(`/api/carts/66283f6048d814c675b90564/product/65710f626a51651674803480`)
                .set("Cookie", cookie)

            expect(testing.statusCode).to.be.equal(200)
            expect(testing.body.message).to.exist.and.to.be.equal("product added to cart successfully")
        })

        it("Testing delete product from cart", async function () {
            let testing = await requester.delete(`/api/carts/66283f6048d814c675b90564/product/65710f626a51651674803480`)
                .set("Cookie", cookie)

            expect(testing.statusCode).to.be.equal(200)
            expect(testing.body.message).to.exist.and.to.be.equal("product deleted to cart successfully")

        })    

        it("Testing delete all product in cart", async () => {
            let testing = await requester.delete(`/api/carts/66283f6048d814c675b90564`)
                .set("Cookie", cookie)

            expect(testing.statusCode).to.be.equal(200)
            expect(testing.body.message).to.exist.and.to.be.equal("cart empty successfully")
        })
    })

})