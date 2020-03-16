import Review from '../models/Review.model';
interface ICreateReview{
    hpid:string,
    userIndex:number,
    contents:string,
    img?: string,
}
class ReviewService {
    constructor() {
        
    }


    async createReview(reviewData:ICreateReview) { 
        const resultReview = await Review.create(reviewData);
        return resultReview.toJSON();
    }

    async getMyReview(userIndex:number) {
        const option = {
            where: {
                userIndex: userIndex
            }
        }
        const result = await Review.findAndCountAll(option);

        return result;
    }

    async getUserReview(userIndex) {
        console.log(userIndex);
        const option = {
            where: {
                userIndex: userIndex
            }
        }
        const result = await Review.findAndCountAll(option);
        return result;
    }

    async updateReview(reviewIndex, userIndex, contents, imgUrl) {
        const change = { contents: contents, img: imgUrl };
        const option = {
            where: {
                reviewIndex: reviewIndex,
                userIndex: userIndex
            }
        }
        const result = await Review.update(change, option);
        console.log(result, typeof result[0]);
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
}

export const reviewService = new ReviewService();