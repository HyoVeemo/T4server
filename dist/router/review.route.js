"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_service_1 = require("../service/review.service");
const user_service_1 = require("../service/user.service");
const auth_util_1 = require("../utils/auth.util");
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const imageUpload_util_1 = require("../utils/imageUpload.util");
class ReviewRoute {
    constructor() {
        this.reviewRouter = express_1.default.Router();
        this.upload = multer_1.default();
        this.reviewRouter.post('/review/img', auth_middleware_1.verifyUser, imageUpload_util_1.S3Upload('reviewImage').single('img'), imageUpload_util_1.uploadImg); // S3에 이미지 업로드하는 라우터
        this.reviewRouter.post('/review/hpid/:hpid', auth_middleware_1.verifyUser, this.upload.none(), postReview); // 리뷰(이미지 포함) 등록 라우터
        this.reviewRouter.get('/review/hpid/:hpid', getAllReview); // 한 병원의 모든 리뷰 가져오는 라우터
        this.reviewRouter.get('/review', auth_middleware_1.verifyUser, getMyReview); // 리뷰 모아보기
        this.reviewRouter.get('/review/userNickName/:userNickName', getReviewByUserNickName);
        this.reviewRouter.patch('/review/reviewIndex/:reviewIndex', auth_middleware_1.verifyUser, this.upload.none(), updateReview); // 리뷰 수정 라우터
        this.reviewRouter.delete('/review/reviewIndex/:reviewIndex', auth_middleware_1.verifyUser, deleteReview); // 리뷰 삭제 라우터
        this.reviewRouter.get('/review/rating/hpid/:hpid', getRating); // 한 병원 평점 가져오기
        this.reviewRouter.get('/review/ratings', getRatings); // 모든 병원 평점 가져오기
    }
}
function postReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const hpid = req.params.hpid;
        const { tokenIndex: userIndex } = auth_util_1.auth(req);
        const contents = req.body.contents;
        const imgUrl = req.body.url; // 이미지 주소
        const rating = req.body.rating; // 별점
        try {
            /* 7일 이내 예약 정보 개수*/
            const count = yield review_service_1.reviewService.validateQualificationForWritingReview(userIndex, hpid);
            if (count) {
                const reviewData = {
                    hpid,
                    userIndex,
                    contents,
                    img: imgUrl,
                    rating
                };
                const result = yield review_service_1.reviewService.createReview(reviewData); // JSON 포맷 형식인 resultReview 반환받음.
                res.send({
                    success: true,
                    result,
                    message: 'createReview: 200'
                });
            }
            else {
                res.send({
                    success: false,
                    result: '예약 후 병원을 방문해야 리뷰 작성이 가능합니다.',
                    message: 'createReview: 500'
                });
            }
        }
        catch (err) {
            console.error(err);
            res.send({
                success: false,
                message: 'createReview: 500'
            });
        }
        ;
    });
}
function getAllReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield review_service_1.reviewService.getAllReview(req.params.hpid);
            res.send({
                success: true,
                result,
                message: 'getAllReview: 200'
            });
        }
        catch (err) {
            res.send({
                success: false,
                message: 'getAllReview: 500'
            });
        }
    });
}
function getMyReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tokenIndex: userIndex } = auth_util_1.auth(req);
        try {
            const result = yield review_service_1.reviewService.getMyReview(userIndex);
            res.send({
                success: true,
                result,
                message: 'getReview: 200'
            });
        }
        catch (err) {
            res.send({
                success: false,
                message: 'getReview: 500'
            });
        }
    });
}
function getReviewByUserNickName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userNickName = req.params.userNickName;
        try {
            const resultUser = yield user_service_1.userService.getUser(userNickName);
            const result = yield review_service_1.reviewService.getUserReview(resultUser.userIndex);
            res.send({
                success: true,
                result,
                message: 'getReviewByUserNickName: 200'
            });
        }
        catch (err) {
            console.error(err);
            res.send({
                success: false,
                message: 'getReviewByUserNickName: 500'
            });
        }
    });
}
function updateReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reviewIndex = req.params.reviewIndex;
        const { tokenIndex: userIndex } = auth_util_1.auth(req);
        const updateData = {
            contents: req.body.contents,
            rating: req.body.rating,
            imgUrl: req.body.url
        };
        try {
            const resultReview = yield review_service_1.reviewService.updateReview(reviewIndex, userIndex, updateData);
            res.send({
                success: true,
                result: resultReview,
                message: 'updateReview: 200'
            });
        }
        catch (err) {
            console.error(err);
            res.send({
                success: false,
                message: 'updateReview: 500'
            });
        }
    });
}
function deleteReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reviewIndex = req.params.reviewIndex;
        const { tokenIndex: userIndex } = auth_util_1.auth(req);
        try {
            const result = yield review_service_1.reviewService.deleteReview(reviewIndex, userIndex);
            res.send({
                success: true,
                result,
                message: 'deleteReview: 200'
            });
        }
        catch (err) {
            console.log(err);
            res.send({
                success: false,
                message: 'deleteReview: 500'
            });
        }
    });
}
function getRating(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hpid = req.params.hpid;
            const sequelize = req.app.locals.sequelize;
            const result = yield review_service_1.reviewService.getRating(sequelize, hpid);
            res.send({
                success: true,
                result,
                message: 'getRating: 200'
            });
        }
        catch (err) {
            console.error(err);
            res.send({
                success: false,
                message: 'getRating: 500'
            });
        }
    });
}
function getRatings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sequelize = req.app.locals.sequelize;
            const result = yield review_service_1.reviewService.getRatings(sequelize);
            res.send({
                success: true,
                result,
                message: 'getRatings: 200'
            });
        }
        catch (err) {
            console.error(err);
            res.send({
                success: false,
                message: 'getRatings: 500'
            });
        }
    });
}
exports.reviewRoute = new ReviewRoute();
//# sourceMappingURL=review.route.js.map