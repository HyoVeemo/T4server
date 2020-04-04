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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
class ReviewRoute {
    constructor() {
        this.reviewRouter = express_1.default.Router();
        this.upload = multer_1.default({
            storage: multer_s3_1.default({
                s3: new aws_sdk_1.default.S3(),
                bucket: 't4bucket0',
                key(req, file, cb) {
                    cb(null, `original/${+new Date()}${path_1.default.basename(file.originalname)}`);
                }
            }),
            limits: { fileSize: 5 * 1024 * 1024 },
        });
        this.reviewRouter.post('/img', this.upload.single('img'), uploadImg); // S3에 이미지 업로드하는 라우터
        this.upload2 = multer_1.default();
        this.reviewRouter.post('/review/hpid/:hpid', this.upload2.none(), postReview); // 리뷰(이미지 포함) 등록 라우터
        this.reviewRouter.get('/review/hpid/:hpid', getAllReview); // 한 병원의 모든 리뷰 가져오는 라우터
        this.reviewRouter.get('/review', getMyReview); // 리뷰 모아보기
        this.reviewRouter.get('/review/userNickName/:userNickName', getReviewByUserNickName);
        this.reviewRouter.patch('/review/reviewIndex/:reviewIndex', this.upload2.none(), updateReview); // 리뷰 수정 라우터
        this.reviewRouter.delete('/review/reviewIndex/:reviewIndex', deleteReview); // 리뷰 삭제 라우터
        this.reviewRouter.get('/review/rating/hpid/:hpid', getRating); // 한 병원 평점 가져오기
        this.reviewRouter.get('/review/ratings', getRatings); // 모든 병원 평점 가져오기
    }
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
function uploadImg(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(req.file);
        res.json({ url: req.file.location });
    });
}
function postReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const hpid = req.params.hpid;
        const { tokenIndex: userIndex } = auth_util_1.auth(req);
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
            const result = yield review_service_1.reviewService.createReview(reviewData); // JSON 포맷 형식인 resultReview 반환받음.
            res.send({
                success: true,
                result,
                message: 'createReview: 200'
            });
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
function updateReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reviewIndex = req.params.reviewIndex;
        const { tokenIndex: userIndex } = auth_util_1.auth(req);
        const contents = req.body.contents;
        const imgUrl = req.body.url || null;
        try {
            const resultReview = yield review_service_1.reviewService.updateReview(reviewIndex, userIndex, contents, imgUrl);
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