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
const User_model_1 = __importDefault(require("../models/User.model"));
const Review_model_1 = __importDefault(require("../models/Review.model"));
const Reservation_model_1 = __importDefault(require("../models/Reservation.model"));
const sequelize_1 = require("sequelize");
class ReviewService {
    constructor() {
    }
    createReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultReview = yield Review_model_1.default.create(reviewData);
            return resultReview.toJSON();
        });
    }
    getAllReview(hpid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const option = {
                    where: {
                        hpid: hpid
                    },
                    order: [sequelize_1.Sequelize.literal('createdAt DESC')],
                    include: [
                        {
                            model: User_model_1.default,
                            attributes: ['userNickName']
                        }
                    ]
                };
                const result = yield Review_model_1.default.findAndCountAll(option);
                return result;
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    getMyReview(userIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const option = {
                where: {
                    userIndex: userIndex
                },
                order: [sequelize_1.Sequelize.literal('createdAt DESC')]
            };
            const result = yield Review_model_1.default.findAndCountAll(option);
            return result;
        });
    }
    getUserReview(userIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const option = {
                where: {
                    userIndex: userIndex
                },
                order: [sequelize_1.Sequelize.literal('createdAt DESC')],
                include: [
                    {
                        model: User_model_1.default,
                        attributes: ['userNickName']
                    }
                ]
            };
            const result = yield Review_model_1.default.findAndCountAll(option);
            return result;
        });
    }
    updateReview(reviewIndex, userIndex, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const change = { contents: updateData.contents, rating: updateData.rating, img: updateData.imgUrl };
            const option = {
                where: {
                    reviewIndex: reviewIndex,
                    userIndex: userIndex
                }
            };
            const result = yield Review_model_1.default.update(change, option);
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
    validateQualificationForWritingReview(userIndex, hpid) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "SELECT count(*) FROM Reservations";
            query += " WHERE userIndex = :userIndex";
            query += " AND hpid = :hpid";
            query += " AND status = :status";
            query += " AND DATE(reservationDate) BETWEEN NOW() - INTERVAL 7 day AND NOW()";
            const values = {
                userIndex: userIndex,
                hpid: hpid,
                status: 'TIMEOUT'
            };
            const result = yield Reservation_model_1.default.sequelize.query(query, { replacements: values });
            return result[0][0]['count(*)'];
        });
    }
}
exports.reviewService = new ReviewService();
//# sourceMappingURL=review.service.js.map