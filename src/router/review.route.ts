import express from 'express';
import { reviewService } from '../service/review.service'
import { verify } from '../middleware/auth.middleware'
import { userService } from '../service/user.service'
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
        this.reviewRouter.post('/img', verify, this.upload.single('img'), uploadImg); // S3에 이미지 업로드하는 라우터
        this.upload2 = multer();
        this.reviewRouter.post('/review/:hpid', verify, this.upload2.none(), postReview); // 리뷰(이미지 포함) 등록 라우터
        this.reviewRouter.patch('/review/:idx', verify, this.upload2.none(), updateReview); // 리뷰 수정 라우터
        this.reviewRouter.delete('/review/:idx', verify, deleteReview); // 리뷰 삭제 라우터
        this.reviewRouter.get('/review', verify, getMyReview); // 리뷰 모아보기
        this.reviewRouter.get('/review/:nick', verify, getUserReview);
        this.reviewRouter.get('/rating/:hpid', verify, getRating); // 특정 병원 별점 보기
        this.reviewRouter.get('/ratings', verify, getRatings); // 병원별 별점 보기
    }
}

async function uploadImg(req, res) {
    // console.log(req.file);
    res.json({ url: req.file.location });
}

async function postReview(req, res) {
    const hpid = req.params.hpid;
    const userId = res.locals.userId;
    const contents = req.body.contents;
    const imgUrl = req.body.url; // 이미지 주소
    const rating = req.body.rating; // 별점

    try {
        const resultUser = await userService.getUser(userId);
        const userIndex = resultUser.getDataValue('userIndex');
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
    }
}

async function updateReview(req, res) {
    const reviewIndex = req.params.idx;
    const userId = res.locals.userId;
    const contents = req.body.contents;
    const imgUrl = req.body.url || null;
    try {
        const resultUser = await userService.getUser(userId);
        const userIndex = resultUser.getDataValue('userIndex');
        const result = await reviewService.updateReview(reviewIndex, userIndex, contents, imgUrl);
        res.send({
            success: true,
            result,
            message: 'updateReview: 200'
        });
    } catch (err) {
        console.error(err);
    }

}

async function deleteReview(req, res) { // 왜 여기선 function 붙이고
    const reviewIndex = req.params.idx;
    const userId = res.locals.userId;
    try {
        const resultUser = await userService.getUser(userId);
        const userIndex = resultUser.getDataValue('userIndex');
        const result = await reviewService.deleteReview(reviewIndex, userIndex);
        res.send({
            success: true,
            result,
            message: 'deleteReview: 200'
        });
    } catch (err) {
        console.error(err);
    }

}

async function getMyReview(req, res) {
    const userId = res.locals.userId;
    try {
        const resultUser = await userService.getUser(userId);
        const userIndex = resultUser.getDataValue('userIndex');
        const result = await reviewService.getMyReview(userIndex);
        res.send({
            success: true,
            result,
            message: 'getReview: 200'
        });
    } catch (err) {
        console.error(err);
    }
}

async function getUserReview(req, res) {
    const userNickName = req.params.nick;
    console.log('userNick: ', userNickName);
    try {
        const resultUser = await userService.getUser(userNickName);
        console.log('resultUser: ', resultUser);
        const userIndex = resultUser.getDataValue('userIndex');
        const result = await reviewService.getUserReview(userIndex);
        res.send({
            success: true,
            result,
            message: 'getUserReview: 200'
        });
    } catch (err) {
        console.error(err);
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
    }
}
export const reviewRoute = new ReviewRoute();