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
const Review_model_1 = __importDefault(require("../models/Review.model"));
class ReviewService {
    constructor() {
    }
    createReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultReview = yield Review_model_1.default.create(reviewData);
            return resultReview.toJSON();
        });
    }
    getMyReview(userIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const option = {
                where: {
                    userIndex: userIndex
                }
            };
            const result = yield Review_model_1.default.findAndCountAll(option);
            return result;
        });
    }
    getUserReview(userIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userIndex);
            const option = {
                where: {
                    userIndex: userIndex
                }
            };
            const result = yield Review_model_1.default.findAndCountAll(option);
            return result;
        });
    }
    updateReview(reviewIndex, userIndex, contents, imgUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const change = { contents: contents, img: imgUrl };
            const option = {
                where: {
                    reviewIndex: reviewIndex,
                    userIndex: userIndex
                }
            };
            const result = yield Review_model_1.default.update(change, option);
            console.log(result, typeof result[0]);
            if (result[0] === 0) {
                return '해당 리뷰가 존재하지 않아 변화 없음.';
            }
            else {
                return change;
            }
        });
    }
    deleteReview(reviewIndex, userIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const option = {
                where: {
                    reviewIndex: reviewIndex,
                    userIndex: userIndex
                }
            };
            const result = yield Review_model_1.default.destroy(option);
            if (result === 0) {
                return '해당 리뷰가 존재하지 않아 변화 없음.';
            }
        });
    }
    getRating(sequelize, hpid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Review_model_1.default.findOne({
                where: {
                    hpid: hpid
                },
                attributes: ['hpid', [sequelize.fn('AVG', sequelize.col('rating')), 'ratingAvg']],
            });
        });
    }
    getRatings(sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Review_model_1.default.findAll({
                attributes: ['hpid', [sequelize.fn('AVG', sequelize.col('rating')), 'ratingAvg']],
                group: 'hpid',
                order: [[sequelize.fn('AVG', sequelize.col('rating')), 'DESC']]
            });
        });
    }
}
exports.reviewService = new ReviewService();
//# sourceMappingURL=review.service.js.map