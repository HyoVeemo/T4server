import express from 'express';
import request from 'request-promise-native';

class hashtagRoute{
    public hashtagRouter: express.Router = express.Router();
    
    constructor(){
        this.hashtagRouter.post('/hashTag', createHashtag);
        this.hashtagRouter.get('/heashTag')
    }
}


/**
 * route: 해시태그 생성
 * @param req 
 * @param res 
 */
async function createHashtag(req, res){
    const client = req.app.locals.client;
    // hashtag
    // hashtagIndex, 
    // hashtagName
    try{
        const result = await client.index({
            index: 'hashtag',
            body:{
            ...req.body            
            }
        })
        res.send({
            message: 'createHashtag',
            result,
            statusCode: 200
        })
    }catch(err){
        res.send({
            statuscode: 500,
            message:'createHashtag'
        })
    }
}

/**
 * route : hashtag 전체 조회
 * 
 */
async function listHashtag(req, res){
    const params = {
        index: 'hashtag'
    }
    const client = req.app.locals.client
    try{
        const { body } = await client.search(params);
        res. send({
            success: true, 
            statusCode: 200, 
            message: 'listHashtag: 200',
            result: body.hits.hits
        })
    }catch(err){
        console.error(err);
        res.send({
            success: false, 
            statusCode: 500 , 
            message: 'listHashtag: 500'
        })
    }
}

/**
 * route: hashTag 업데이트
 * @param req
 * @param res 
 */
async function updateHashtag(req, res){

}

/**
 * route: hashTag 삭제
 * @param req 
 * @param res 
 */
async function deleteHashtag(req, res){

}