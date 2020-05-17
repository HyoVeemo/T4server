import * as express from 'express'
import { postsService } from '../service/posts.service'
import { verifyUser } from '../middleware/auth.middleware';

class PostsRoute {
    public postsRouter: express.Router = express.Router();
    constructor() {
        this.postsRouter.post('/posts', verifyUser, createPosts);
        this.postsRouter.get('/posts/:postsIndex', getPosts);
        this.postsRouter.get('/posts', listPosts);
        this.postsRouter.put('/posts/:postsIndex', verifyUser, updatePosts);
        this.postsRouter.delete('/posts/:postsIndex', verifyUser, deletePosts);
    }
}

async function createPosts(req: express.Request, res: express.Response) {
    try {
        //let postsData = req.body;
        const result = await postsService.createPosts({
            ...req.body
        });

        //elastic search에 저장
        const client = req.app.locals.client;
        await client.index({
            index: 'posts',
            body: result
        })
        res.send({
            success: true,
            result,
            statusCode: 200,
            message: 'CreatePosts'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            statusCode: 500,
            message: 'createPosts:500'
        })
    }
}

async function getPosts(req, res) {
    try {
        const client = req.app.locals.client;
        const postsIndex = req.params.postsIndex;
        //const result = await postsService.getPosts(postsIndex);
        const params = {
            index: 'posts',
            body: {
                query: {
                    match: {
                        'postIndex._integer': postsIndex
                    }
                }
            }
        }
        const { body } = client.search(params);

        res.send({
            success: true,
            //result,
            result: body.hits.hits,
            statusCode: 200,
            message: 'getPosts'
        });
    } catch (err) {
        res.send({
            success: false,
            statusCode: 500,
            message: 'getPosts:500'
        })
    }
}

/**
 * router: 전체 게시글 조회, 제목으로 검색
 * @param req 
 * @param res 
 */
async function listPosts(req, res) {
    try {
        const client = req.app.locals.client
        // listPosts?filter=""&pn={"offset":0,"page":1} 
        let { filter, pn } = req.query;

        filter = JSON.parse(filter);
        pn = JSON.parse(filter);
        let params = {
            index: 'posts',
            body: {
                from: pn.offset * (pn.page - 1),
                size: pn.offset,
                query: {
                    "dis_max": {
                        "queries": [
                            { "match": { 'title._text.nori': filter } }
                        ]
                    }
                }
            }
        }
        const { body } = await client.search(params);
        console.log('listsposts:', body);
        res.send({
            success: true,
            result: body.hits.hits,
            statusCode: 200,
            message: 'listPosts'
        });
    } catch (err) {
        res.send({
            success: false,
            statusCode: 500,
            message: 'listPosts:500'
        })
    }
}

async function listPostsByHashtag(req, res) {

}

async function updatePosts(req, res) {
    try {
        const postsIndex = req.params.postsIndex;
        const result = await postsService.updatePosts({
            ...req.body
        }, postsIndex);

        res.send({
            success: true,
            result,
            statusCode: 200,
            message: 'updatePosts'
        });
    } catch (err) {
        res.send({
            success: false,
            statusCode: 500,
            message: 'updatePosts:500'
        })
    }
}

async function deletePosts(req, res) {
    try {
        const postsIndex = req.params.postsIndex;
        const result = await postsService.deletePosts(postsIndex);
        res.send({
            success: true,
            result,
            statusCode: 200,
            message: 'deletePosts'
        });

    } catch (err) {
        res.send({
            success: false,
            statusCode: 500,
            message: 'deletePosts'
        })
    }
}