import * as express from 'express'
import { hashtagService } from '../service/hashtag.service';
import { postsHashtagService } from '../service/postsHashtag.service';
import { S3Upload, uploadImg } from '../utils/imageUpload.util';

class PostsRoute {
    public postsRouter: express.Router = express.Router();
    constructor() {
        this.postsRouter.post('/posts/img', S3Upload('postsImage').single('img'), uploadImg); // S3에 이미지 업로드하는 라우터
        this.postsRouter.post('/posts', createPosts);
        this.postsRouter.get('/posts', listPosts);
        this.postsRouter.delete('/posts/:postsId', deletePosts);
    }
}

async function createPosts(req: express.Request, res: express.Response) {
    try {
        let hashtags;
        hashtags = req.body.hashtag.split(',')

        const client = req.app.locals.client;
        const result = await client.index({
            index: 'posts',
            body: {
                "title._text": req.body.title,
                "url._text": req.body.url,
                "img._text": req.body.img,
                "hashtag._text": hashtags
            }
        })

        for (const row of hashtags) {
            //DB에 해시태그 추가하는 함수
            let resultHashtag = await hashtagService.getHashtag(row);
            if (!resultHashtag) {
                resultHashtag = await hashtagService.createHashtag({
                    hashtagName: row
                })
            }
            //DB에 해시태그-게시물 관계 추가하는 함수
            await postsHashtagService.createPostsHashtag({
                postsIndex: result.body._id,
                hashtagIndex: resultHashtag.hashtagIndex
            })
        }

        res.send({
            success: true,
            statusCode: 200,
            result,
            message: 'createPosts'
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

/**
 * router: 전체 게시글 조회, 제목으로 검색
 * @param req 
 * @param res 
 */
async function listPosts(req, res) {
    const client = req.app.locals.client
    // 입력 예: Posts?filter=""&pn={"offset":0,"page":1} 
    let { filter, pn } = req.query;
    pn = pn == undefined ? undefined : JSON.parse(pn);

    let params: any =
    {
        "index": "posts",
        "body": {}
    }


    if (filter) {
        params.body = {
            "query": {
                "dis_max": {
                    "queries": [
                        { "match": { "title._text.nori": filter } },
                        { "match": { "hashtag._text.nori": filter } }
                    ]
                }
            }
        }
    }

    if (pn) {
        params.body.from = pn.offset * (pn.page - 1);
        params.body.size = pn.offset;
    }
    try {
        const { body } = await client.search(params);
        res.send({
            success: true,
            result: body.hits.hits,
            statusCode: 200,
            message: 'listPosts'
        });
    } catch (err) {
        console.log(err)
        res.send({
            success: false,
            statusCode: 500,
            message: 'listPosts:500'
        })
    }
}

async function deletePosts(req, res) {
    try {
        const postsId = req.params.postsId
        const client = req.app.locals.client;
        const params = {
            id: postsId,
            index: "posts"
        }
        const result = await client.delete(params);
        const resultHash = await postsHashtagService.deletePostsHashtag(postsId);

        //const result = await postsService.deletePosts(postsIndex);
        res.send({
            success: true,
            result,
            statusCode: 200,
            message: 'deletePosts'
        });

    } catch (err) {

        console.log(err);
        res.send(
            {
                success: false,
                statusCode: 500,
                message: 'deletePosts'
            })
    }
}

export const postsRoute = new PostsRoute();