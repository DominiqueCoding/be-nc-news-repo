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

describe("POST /api/articles/:article_id/comments",()=>{
    it("201:accepts a body with the properties of username and body, responds with the posted comment",()=>{
        return request(app).post("/api/articles/2/comments")
        .send({
            username: 'icellusedkars',
            body: "this author is really cool"
        })
        .expect(201)
        .then(({body})=>{

            const commentArr = body

            expect(commentArr).toHaveLength(1)
            commentArr.forEach((comment) =>{
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: 2
                })
            })     
        })
    })

    it("404:returns error when username does not exist",()=>{
        return request(app).post("/api/articles/2/comments")
        .send({
            username: 'non-existant-username',
            body: "this author is really cool"
        })
        .expect(404)
    })

    it("201:Ignores any unnecessary properties on the request body.",()=>{
        return request(app).post("/api/articles/2/comments")
        .send({
            unnecessary_property3: "unnecessary value3",
            username: 'icellusedkars',
            body: "this author is really cool",
            unnecessary_property: "unnecessary value",
            unnecessary_property2: "unnecessary value2"
        })
        .expect(201)
        .then(({body})=>{

            const commentArr = body

            expect(commentArr).toHaveLength(1)
            commentArr.forEach((comment) =>{
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: 2
                })
            })     
        })
    })

    it("400: returns Bad request error when article_id is invalid",()=>{
        return request(app).post("/api/articles/non_exist/comments")
        .send({
            username: 'icellusedkars',
            body: "this author is really cool",
        })
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toEqual("bad request")     
        })
    })

    it("404: returns not found error when article_id does not exist",()=>{
        return request(app).post("/api/articles/5000/comments")
        .send({
            username: 'icellusedkars',
            body: "this author is really cool",
        })
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toEqual("not found")     
        })
    })

    it("400: Responds with error object including status and message when body is incomplete ",()=>{
        return request(app).post("/api/articles/2/comments")
        .send({
            username: 'icellusedkars'
        })
        .expect(400)
        .then(({body})=>{
            expect(body).toEqual({code:400,msg:"bad request"})     
        })
    })

})
  
describe("PATCH /api/articles/:article_id",()=>{
    it("200:updates the correct article by id",()=>{
        return request(app).patch("/api/articles/5")
        .send({
            inc_votes : 1
        })
        .expect(200)
        .then(({body})=>{
            const article = body

            expect(article).toMatchObject({
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

    it("200:updates the article votes, increments votes by 1",()=>{
        return request(app).patch("/api/articles/1")
        .send({
            inc_votes : 1
        })
        .expect(200)
        .then(({body})=>{
            const article = body

            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: 101,
                article_img_url: expect.any(String),
            })
             
        })
    })

    it("200:updates the article votes, decrements votes by 100",()=>{
        return request(app).patch("/api/articles/2")
        .send({
            inc_votes : -100
        })
        .expect(200)
        .then(({body})=>{
            const article = body

            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: -100,
                article_img_url: expect.any(String),
            })
             
        })
    })

    it("200:ignores unneccesary fields",()=>{
        return request(app).patch("/api/articles/3")
        .send({
            not_votes : "100",
            inc_votes : -1,
            not_votes : 100
        })
        .expect(200)
        .then(({body})=>{
            const article = body

            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: -1,
                article_img_url: expect.any(String),
            })
             
        })
    })

    it("400:returns Bad request error when article_id is invalid",()=>{
        return request(app).patch("/api/articles/2_something")
        .send({
            inc_votes : -1,
        })
        .expect(400)
        .then(({body})=>{
            const article = body

            expect(article.msg).toEqual("bad request")
             
        })
    })

    it("400:responds with status and error code when body is incomplete",()=>{
        return request(app).patch("/api/articles/2")
        .send({

        })
        .expect(400)
        .then(({body})=>{
            const article = body

            expect(article).toEqual({code:400,msg:"bad request"})
             
        })
    })
    
    it("404:returns not found error when article_id does not exist",()=>{
        return request(app).patch("/api/articles/200000")
        .send({
            inc_votes : -1
        })
        .expect(404)
        .then(({body})=>{
            const article = body
            expect(article.msg).toEqual("not found")
        })
    })
})

describe("DELETE /api/comments/:comment_id",()=>{
    it("204:delete the comment by id, responds with 204 and no content",()=>{
        return request(app).delete("/api/comments/4")
        .expect(204)
        .then(({body})=>{
            const deletedComment = body
            expect(deletedComment).toEqual({})
        })
    })

    it("400:returns error if id invalid",()=>{
        return request(app).delete("/api/comments/invalid_id")
        .expect(400)
        .then(({body})=>{
            const deletedComment = body
            expect(deletedComment.msg).toEqual("bad request")
        })
    })

    it("404:returns error when comment does not exist",()=>{
        return request(app).delete("/api/comments/6000")
        .expect(404)
        .then(({body})=>{
            const deletedComment = body
            expect(deletedComment.msg).toEqual("not found")
        })
    })
})

describe("GET /api/users",()=>{

    it("200:get an array of all users with the correct properties",()=>{
        return request(app).get("/api/users").expect(200)
        .then(({body})=>{

            const userArr = body

            expect(userArr).toHaveLength(4)
            userArr.forEach((user) =>{
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })

    })

    it("404: returns error with invalid path",()=>{
        return request(app).get("/api/userssss").expect(404)
    })
})

describe("GET /api/articles topic query",()=>{
    it("200:if query is ommitted return all articles",()=>{
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

    it("200:if query is specified return articles that have the topic",()=>{
        return request(app).get("/api/articles?topic=cats").expect(200)
        .then(({body})=>{

            const articleObjects = body
            
            expect(articleObjects).toHaveLength(1)
            articleObjects.forEach((article) =>{
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: "cats",
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String),
                })
            })

            
        })
    })

    it("404: if query is invalid return error",()=>{
        return request(app).get("/api/articles?topic=not_found").expect(404)
        .then(({body})=>{
            expect(body).toEqual({ code: 404, msg: 'not found' })
        })
    })

    it.only("200: if topic query exists but has no articles, it returns an empty array",()=>{
        return request(app).get("/api/articles?topic=paper").expect(200)
        .then(({body})=>{
            expect(body).toEqual([])
        })
    })
})
    
