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

describe("GET /api/articles",()=>{
    it("200:should return array of article object with correct properties",()=>{
        return request(app).get("/api/articles").expect(200)
        .then(({body})=>{

            const articleObjects = body
            
            expect(articleObjects).toHaveLength(13)
            articleObjects.forEach((article) =>{
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String),
                })
            })
        })
    })

    it("200:should return array of article object in decending order",()=>{
        return request(app).get("/api/articles").expect(200)
        .then(({body})=>{

            const articleObjects = body

            expect(articleObjects).toBeSortedBy('created_at', {descending: true});
            
        })
    })

    it("200:should return and not have a body property, body property should be replaced by comment count",()=>{
        return request(app).get("/api/articles").expect(200)
        .then(({body})=>{

            const articleObjects = body

            articleObjects.forEach((article) =>{
                expect("body" in article).toEqual(false)
            })
            
            
            
        })
    })
})

describe("GET /api/articles/:article_id/comments",()=>{
    it("200:should return with array of comments that match article id, with the same article id properties",()=>{
        return request(app).get("/api/articles/1/comments").expect(200)
        .then(({body})=>{

            const commentArr = body

            expect(commentArr).toHaveLength(11)
            commentArr.forEach((article) =>{
                expect(article).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: 1
                })
            })

     
        })
    })

    it("200:should return an empty array when the article has no comments",()=>{
        return request(app).get("/api/articles/2/comments").expect(200)
        .then(({body})=>{

            const commentArr = body
            expect(commentArr).toEqual([])
        })
    })

    it("200:the most recent comment is displayed first",()=>{
        return request(app).get("/api/articles/3/comments").expect(200)
        .then(({body})=>{
            const commentArr = body
            expect(commentArr).toBeSortedBy('created_at', {descending: true});
        })
    })

    it("404:returns error when valid article_id but does not exist",()=>{
        
        return request(app).get("/api/articles/300/comments").expect(404)
        .then(({body})=>{
            expect(body.msg).toEqual("not found")
            
        })
    })

    it("400:returns error with invalid article_id",()=>{
        return request(app).get("/api/articles/invalid_id/comments").expect(400)
        .then(({body})=>{
            expect(body.msg).toEqual("bad request")
        })
    })

})