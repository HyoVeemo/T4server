import Review from '../models/Review.model';

class ReviewService {
    constructor() { }
    async createReview(reviewData) { // 여긴 function 왜 없냐!!
        const resultReview = await Review.create(reviewData);
        return resultReview.toJSON();
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

    async getMyReview(userIndex) {
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
}

export const reviewService = new ReviewService();