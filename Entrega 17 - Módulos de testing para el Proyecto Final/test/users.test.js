import { expect } from "chai"
import supertest from "supertest"
import { describe, it } from "mocha"
import mongoose from "mongoose"
import { config } from "../src/config/config.dotenv.js"
import bcrypt from "bcrypt"

let cookie
let requester = supertest("http://localhost:8080")

await mongoose.connect(config.mongo_URL, {dbname:config.dbName})

describe("Testing Sergio Divenuto ECommerce", async function () {

    this.timeout(5000)

    describe("Testing users module", async function () {

        after(async () => {
            await mongoose.connection.collection("users").deleteOne({ email: "testing@test.com", });
        })

        it("Testing to create user", async () => {

            let user = {
                first_name: "Testing",
                last_name: "Testing",
                email: "testing@test.com",
                age: 35,
                password: "1234"
            }

            let testing = await requester.post("/api/sessions/signup").send(user)
            let userDB = await mongoose.connection.collection("users").findOne({ email: "testing@test.com" })

            expect(testing.statusCode).to.be.equal(302)
            expect(testing.text).to.exist.and.to.be.equal("Found. Redirecting to /login?mensaje=Usuario%20testing@test.com%20registrado%20correctamente")
            expect(userDB).exist
            expect(userDB.email).to.be.equal("testing@test.com")
            expect(userDB.cart).exist
            expect(bcrypt.compareSync(user.password, userDB.password)).to.be.true;

        })

        it("Testing to login correct", async () => {

            let user = {
                email: "testing@test.com",
                password: "1234"
            }

            let testing = await requester.post("/api/sessions/login").send(user)
            let userDB = await mongoose.connection.collection("users").findOne({ email: "testing@test.com" })

            expect(testing.statusCode).to.be.equal(302)
            expect(testing.text).to.exist.and.to.be.equal("Found. Redirecting to /products")
            expect(userDB).exist
            expect(userDB.email).to.be.equal("testing@test.com")
            expect(userDB.cart).exist
            expect(bcrypt.compareSync(user.password, userDB.password)).to.be.true;

        })

        it("Testing to login incorrect", async () => {

            let user = {
                email: "testing@test.com",
                password: "1234564789"
            }

            let testing = await requester.post("/api/sessions/login").send(user)
            let userDB = await mongoose.connection.collection("users").findOne({ email: "testing@test.com" })

            expect(testing.statusCode).to.be.equal(302)

            expect(testing.text).to.exist.and.to.be.equal("Found. Redirecting to /login?error=credenciales%20incorrectas")
            expect(userDB).exist
            expect(userDB.email).to.be.equal("testing@test.com")
            expect(userDB.cart).exist
            expect(bcrypt.compareSync(user.password, userDB.password)).to.be.false

        })

    })


})