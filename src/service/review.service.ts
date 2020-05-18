import User from '../models/User.model';
import Review from '../models/Review.model';
import Reservation from '../models/Reservation.model';
import { Sequelize } from 'sequelize'

interface ICreateReview {
    hpid: string,
    userIndex: number,
    contents: string,
    img?: string,
}
class ReviewService {
    constructor() {

    }

    async createReview(reviewData: ICreateReview) {
        const resultReview = await Review.create(reviewData);
        return resultReview.toJSON();
    }

    async getAllReview(hpid: string) {
        try {
            const option = {
                where: {
                    hpid: hpid
                },
                order: [Sequelize.literal('createdAt DESC')],
                include: [
                    {
                        model: User,
                        attributes: ['userNickName']
                    }
                ]
            }
            const result = await Review.findAndCountAll(option);

            return result;
        } catch (err) {
            console.error(err);
        }
    }

    async getMyReview(userIndex: number) {
        const option = {
            where: {
                userIndex: userIndex
            },
            order: [Sequelize.literal('createdAt DESC')]
        }
        const result = await Review.findAndCountAll(option);


        return result;
    }

    async getUserReview(userIndex) {
        const option = {
            where: {
                userIndex: userIndex
            },
            order: [Sequelize.literal('createdAt DESC')],
            include: [
                {
                    model: User,
                    attributes: ['userNickName']
                }
            ]
        }
        const result = await Review.findAndCountAll(option);
        return result;
    }

    async updateReview(reviewIndex, userIndex, updateData) {
        const change = { contents: updateData.contents, rating: updateData.rating, img: updateData.imgUrl };
        const option = {
            where: {
                reviewIndex: reviewIndex,
                userIndex: userIndex
            }
        }
        const result = await Review.update(change, option);

        if (result[0] === 0) {
            return '해당 리뷰가 존재하지 않아 변화 없음.';
        } else {
            return change;
        }
    }

    async deleteReview(reviewIndex, userIndex) {
        const option = {
            where: {
                reviewIndex: reviewIndex,
                userIndex: userIndex
            }
        }
        const result = await Review.destroy(option);
        if (result === 0) {
            return '해당 리뷰가 존재하지 않아 변화 없음.';
        }
    }

    async getRating(sequelize, hpid) {
        return await Review.findOne({
            where: {
                hpid: hpid
            },
            attributes: ['hpid', [sequelize.fn('AVG', sequelize.col('rating')), 'ratingAvg']],
        });
    }

    async getRatings(sequelize) {
        return await Review.findAll({
            attributes: ['hpid', [sequelize.fn('AVG', sequelize.col('rating')), 'ratingAvg']],
            group: 'hpid',
            order: [[sequelize.fn('AVG', sequelize.col('rating')), 'DESC']]
        });
    }

    async validateQualificationForWritingReview(userIndex: number, hpid: string) {
        let query = "SELECT count(*) FROM Reservations";
        query += " WHERE userIndex = :userIndex";
        query += " AND hpid = :hpid";
        query += " AND status = :status";
        query += " AND DATE(reservationDate) BETWEEN NOW() - INTERVAL 7 day AND NOW()";

        const values = {
            userIndex: userIndex,
            hpid: hpid,
            status: 'TIMEOUT'
        }

        const result = await Reservation.sequelize.query(query, { replacements: values });

        return result[0][0]['count(*)'];
    }
}

export const reviewService = new ReviewService();