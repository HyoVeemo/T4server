import * as express from 'express'
import { postsService } from '../service/Posts.service'
import { verifyUser } from '../middleware/auth.middleware';

class PostsRoute {
    public postsRouter: express.Router = express.Router();
    constructor(){
        this.postsRouter.post('/posts',verifyUser, createPosts);
        this.postsRouter.get('/posts', listPosts);
        this.postsRouter.get('/posts/:postsIndex',getPosts);
        this.postsRouter.put('/posts/:postsIndex', verifyUser,updatePosts);
        this.postsRouter.delete('/posts/:postsIndex',verifyUser,deletePosts);
    }
}

async function createPosts(req:express.Request, res:express.Response){
    try{
        //let postsData = req.body;
        const result = await postsService.createPosts({
            ...req.body
        });
        res.send({
            success: true,
            result,
            statusCode:200,
            message:'CreatePosts'
        });
    }catch(err){
        res.send({
            success:false,
            result: err,
            statusCode:500,
            message:'createPosts:500'
        })
    }
}

async function getPosts(req,res){
    try{
        const postsIndex = req.params.postsIndex;
        const result = await postsService.getPosts(postsIndex);
        res.send({
            success: true,
            result,
            statusCode:200,
            message:'getPosts'
        });
    }catch(err){
        res.send({
            success:false,
            statusCode:500,
            message:'getPosts:500'
        })
    }
}

async function listPosts(req,res){
    try{

        // listPosts?filter={"content":"내용","title":"제목"}&pn={"offset":0,"page":1}
        let { filter, pn } = req.query;
        filter = JSON.parse(filter);
        pn = JSON.parse(filter);
        const resultCount = await postsService.listPostsCount(filter);
        const result = await postsService.listPosts(filter, pn)
        res.send({
            success: true,
            result,
            statusCode:200,
            message:'listPosts'
        });
    }catch(err){
        res.send({
            success:false,
            statusCode:500,
            message:'listPosts:500'
        })
    }
}

async function updatePosts(req,res){
    try{

        const postsIndex = req.params.postsIndex;
        const result = await postsService.updatePosts({
            ...req.body
        },postsIndex);
        res.send({
            success: true,
            result,
            statusCode:200,
            message:'updatePosts'
        });
    }catch(err){
        res.send({
            success:false,
            statusCode:500,
            message:'updatePosts:500'
        })
    }
}

async function deletePosts(req, res){
    try{
        const postsIndex = req.params.postsIndex ;
        const result = await postsService.deletePosts(postsIndex);
        res.send({
            success: true, 
            result, 
            statusCode:200,
            message:'deletePosts'
        });

    }catch(err){
        res.send({
            success: false,
            statusCode: 500,
            message:'deletePosts'
        })
    }
}