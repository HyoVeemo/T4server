import multer from 'multer';
import express from 'express';
import { auth } from '../utils/auth.util'
import { S3Upload,uploadImg  } from "../utils/imageUpload.util";
import { verifyUser } from '../middleware/auth.middleware';
import { reviewService } from '../service/review.service'
import { userService } from '../service/user.service'

class ReviewRoute {
    public reviewRouter: express.Router = express.Router();
    private upload;

    constructor() {
        this.upload = multer();
        this.reviewRouter.post('/review/img', verifyUser, S3Upload('reviewImage').single('img'), uploadImg); // S3에 이미지 업로드하는 라우터
        this.reviewRouter.post('/review/hpid/:hpid', verifyUser, this.upload.none(), postReview); // 리뷰(이미지 포함) 등록 라우터
        this.reviewRouter.get('/review/hpid/:hpid', getAllReview); // 한 병원의 모든 리뷰 가져오는 라우터
        this.reviewRouter.get('/review', verifyUser, getMyReview); // 리뷰 모아보기
        this.reviewRouter.get('/review/userNickName/:userNickName', getReviewByUserNickName);
        this.reviewRouter.patch('/review/reviewIndex/:reviewIndex', verifyUser, this.upload.none(), updateReview); // 리뷰 수정 라우터
        this.reviewRouter.delete('/review/reviewIndex/:reviewIndex', verifyUser, deleteReview); // 리뷰 삭제 라우터
        this.reviewRouter.get('/review/rating/hpid/:hpid', getRating); // 한 병원 평점 가져오기
        this.reviewRouter.get('/review/ratings', getRatings); // 모든 병원 평점 가져오기
    }
}

async function postReview(req, res) {
    const hpid = req.params.hpid;
    const { tokenIndex: userIndex } = auth(req);
    const contents = req.body.contents;
    const imgUrl = req.body.url; // 이미지 주소
    const rating = req.body.rating; // 별점

    try {
        /* 7일 이내 예약 정보 개수*/
        const count = await reviewService.validateQualificationForWritingReview(userIndex, hpid);
        if (count) {
            const reviewData = {
                hpid,
                userIndex,
                contents,
                img: imgUrl,
                rating
            };

            const result = await reviewService.createReview(reviewData); // JSON 포맷 형식인 resultReview 반환받음.
            res.send({
                success: true,
                result,
                message: 'createReview: 200'
            });
        } else {
            res.send({
                success: false,
                result: '예약 후 병원을 방문해야 리뷰 작성이 가능합니다.',
                message: 'createReview: 500'
            });
        }
    } catch (err) {
        console.error(err);
        res.send({
            success: false,
            message: 'createReview: 500'
        });
    };
}

async function getAllReview(req, res) {
    try {
        const result = await reviewService.getAllReview(req.params.hpid);
        res.send({
            success: true,
            result,
            message: 'getAllReview: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            message: 'getAllReview: 500'
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

async function updateReview(req, res) {
    const reviewIndex = req.params.reviewIndex;
    const { tokenIndex: userIndex } = auth(req);
    const updateData = {
        contents: req.body.contents,
        rating: req.body.rating,
        imgUrl: req.body.url
    };
    try {
        const resultReview = await reviewService.updateReview(reviewIndex, userIndex, updateData);
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
