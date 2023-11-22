const request = require ("supertest")
const app = require("../app")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const fs = require("fs/promises")
const endpoints = require("../endpoints.json")

beforeAll(() => seed (data))
afterAll(() => db.end())

describe("GET /api/topics",() => {
    
    it("404:should Respond with a 404 status for invalid path",()=>{
        return request(app).get("/api/topics/invalid").expect(404)
    })

    it("200:should Respond with an array of topic objects, with properties of slug and description, with status 200",()=>{
        return request(app).get("/api/topics").expect(200)
        .then(({body})=>{
            const topicObjects = body
            
            expect(topicObjects).toHaveLength(3)
            topicObjects.forEach((topic) =>{
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
})

describe("GET /api",() =>{
    
    it("200:should return object with correct endpoints",()=>{
        return request(app).get("/api").expect(200)
        .then(async ({body}) =>{
            expect(body).toEqual(JSON.parse(await fs.readFile('./endpoints.json')))
        })
    })

    it("200:should return endpoints with correct properties",()=>{
        return request(app).get("/api").expect(200)
        .then(({body}) =>{
            expect(body).toEqual(endpoints)
        })
    })

})

describe("GET /api/articles/:article_id",()=>{

    it("200:should return single article by id with all properties",()=>{
        return request(app).get("/api/articles/3").expect(200)
        .then(({body})=>{
    
            expect(body).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
            })
        })
    })

    it("200:should return article with correct id",()=>{
        return request(app).get("/api/articles/3").expect(200)
        .then(({body})=>{

            const id = body.article_id
            expect(id).toEqual(3)
        })
    })

    it("400:should return an error when id is invalid (type mismatch)) ",()=>{
        return request(app).get("/api/articles/invalid_id").expect(400)
        .then(({body})=>{
            expect(body.msg).toEqual("bad request")
        })
    })

    it("404:should return an error when id is valid but does not exist currently ) ",()=>{
        return request(app).get("/api/articles/500").expect(404)
        .then(({body})=>{
            expect(body.msg).toEqual("not found")
        })
    })

    
})