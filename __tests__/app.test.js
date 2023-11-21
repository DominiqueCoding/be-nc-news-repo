const request = require ("supertest")
const app = require("../app")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const fs = require("fs/promises")

beforeAll(() => seed (data))
afterAll(() => db.end())

describe("GET /api/topics",() => {
    
    it("should Respond with a 404 status for invalid path",()=>{
        return request(app).get("/api/topics/invalid").expect(404)
    })

    it("should Respond with an array of topic objects, with properties of slug and description, with status 200",()=>{
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
    
    it("should return object with correct endpoints",()=>{
        return request(app).get("/api").expect(200)
        .then(async ({body}) =>{
            expect(body).toEqual(JSON.parse(await fs.readFile('./endpoints.json')))
        })
    })

    it("should return endpoints with correct properties",()=>{
        return request(app).get("/api").expect(200)
        .then(({body}) =>{

            for(key in body){
                let count = 0
                if(count){
                    expect(body[key]).toMatchObject({
                        description: expect.any(String),
                        queries: expect.any(Array),
                        exampleResponse: expect.any(Object)
                    })
                }
                count++
            }
        })
    })

})

describe("GET /api/articles/:article_id",()=>{
    // return request(app).get("/api").expect(200)
    // .then(({body})=>{

    //     expect(body).toMatchObject({
    //     })
    // })
})