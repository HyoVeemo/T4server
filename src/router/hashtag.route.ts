import express from 'express';
import request from 'request-promise-native';
import {hashtagService} from '../service/hashtag.service';

class HashtagRoute {
    public hashtagRouter: express.Router = express.Router();

    constructor() {
        this.hashtagRouter.get('/hashTag', listHashtag);
    }
}

/**
 * route : hashtag 전체 조회
 * 
 */
async function listHashtag(req, res) {
    try {
        let result = await hashtagService.listHashtag();
        res.send({
            success: true,
            result,
            statusCode: 200,
            message: 'listHashtag: 200'
        })
    } catch (err) {
        console.error(err);
        res.send({
            success: false,
            statusCode: 500,
            message: 'listHashtag: 500'
        })
    }
}

export const hashtagRoute = new HashtagRoute();