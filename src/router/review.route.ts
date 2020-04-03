import express from 'express';
import { reviewService } from '../service/review.service'
import { userService } from '../service/user.service'
import { auth } from '../utils/auth.util'
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

class ReviewRoute {
    public reviewRouter: express.Router = express.Router();
    private upload;
    private upload2;
    constructor() {
        this.upload = multer({
            storage: multerS3({
                s3: new AWS.S3(),
                bucket: 't4bucket0',
                key(req, file, cb) { // S3 t4bucket0에 있는 original 폴더에 업로드 할 것임.
                    cb(null, `original/${+new Date()}${path.basename(file.originalname)}`);
                }
            }),
            limits: { fileSize: 5 * 1024 * 1024 },
        });


        this.reviewRouter.post('/img', this.upload.single('img'), uploadImg); // S3에 이미지 업로드하는 라우터
        this.upload2 = multer();
        this.reviewRouter.post('/review/hpid/:hpid', this.upload2.none(), postReview); // 리뷰(이미지 포함) 등록 라우터
        this.reviewRouter.get('/review', getMyReview); // 리뷰 모아보기
        this.reviewRouter.get('/review/userNickName/:userNickName', getReviewByUserNickName);
        this.reviewRouter.patch('/review/reviewIndex/:reviewIndex', this.upload2.none(), updateReview); // 리뷰 수정 라우터
        this.reviewRouter.delete('/review/reviewIndex/:reviewIndex', deleteReview); // 리뷰 삭제 라우터
        this.reviewRouter.get('/review/rating/hpid/:hpid', getRating); // 한 병원 평점 가져오기
        this.reviewRouter.get('/review/ratings', getRatings); // 모든 병원 평점 가져오기
    }
}

async function uploadImg(req, res) {
    // console.log(req.file);
    res.json({ url: req.file.location });
}

async function postReview(req, res) {
    const hpid = req.params.hpid;
    const { tokenIndex: userIndex } = auth(req);
    const contents = req.body.contents;
    const imgUrl = req.body.url; // 이미지 주소
    const rating = req.body.rating; // 별점

    try {
        const reviewData = {
            hpid: hpid,
            userIndex: userIndex,
            contents: contents,
            img: imgUrl,
            rating: rating
        };

        const result = await reviewService.createReview(reviewData); // JSON 포맷 형식인 resultReview 반환받음.
        res.send({
            success: true,
            result,
            message: 'createReview: 200'
        });

    } catch (err) {
        console.error(err);
        res.send({
            success: false,
            message: 'createReview: 500'
        });
    };
}

async function updateReview(req, res) {
    const reviewIndex = req.params.reviewIndex;
    const { tokenIndex: userIndex } = auth(req);
    const contents = req.body.contents;
    const imgUrl = req.body.url || null;
    try {
        const resultReview = await reviewService.updateReview(reviewIndex, userIndex, contents, imgUrl);
        res.send({
            success: true,
            result: resultReview,
            message: 'updateReview: 200'
        });
    } catch (err) {
        console.error(err);
        res.send({
            success: false,
            message: 'updateReview: 500'
        });
    }
}

async function getMyReview(req, res) {
    const { tokenIndex: userIndex } = auth(req);
    try {
        const result = await reviewService.getMyReview(userIndex);
        res.send({
            success: true,
            result,
            message: 'getReview: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            message: 'getReview: 500'
        });
    }
}

async function getReviewByUserNickName(req, res) {
    const userNickName = req.params.userNickName;
    try {
        const resultUser = await userService.getUser(userNickName);
        const result = await reviewService.getUserReview(resultUser.userIndex);
        res.send({
            success: true,
            result,
            message: 'getReviewByUserNickName: 200'
        });
    } catch (err) {
        console.error(err);
        res.send({
            success: false,
            message: 'getReviewByUserNickName: 500'
        });
    }
}

async function deleteReview(req, res) {
    const reviewIndex = req.params.reviewIndex;
    const { tokenIndex: userIndex } = auth(req);
    try {
        const result = await reviewService.deleteReview(reviewIndex, userIndex);
        res.send({
            success: true,
            result,
            message: 'deleteReview: 200'
        });
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
            message: 'deleteReview: 500'
        });
    }

}

async function getRating(req, res) {
    try {
        const hpid = req.params.hpid;
        const sequelize = req.app.locals.sequelize;
        const result = await reviewService.getRating(sequelize, hpid);
        res.send({
            success: true,
            result,
            message: 'getRating: 200'
        });
    } catch (err) {
        console.error(err);
        res.send({
            success: false,
            message: 'getRating: 500'
        });
    }
}

async function getRatings(req, res) { // 병원별 별점 
    try {
        const sequelize = req.app.locals.sequelize;
        const result = await reviewService.getRatings(sequelize);
        res.send({
            success: true,
            result,
            message: 'getRatings: 200'
        });
    } catch (err) {
        console.error(err);
        res.send({
            success: false,
            message: 'getRatings: 500'
        });
    }
}
export const reviewRoute = new ReviewRoute();
