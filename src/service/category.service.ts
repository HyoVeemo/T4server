import Category from '../models/Category.model';

export class CategoryService {
    constructor() {
    }

    async listCategory() {
        let resultCategory = await Category.findAll();
        let results: Array<any> = [];
        for (const row of resultCategory) {
            results.push(row.toJSON());
        }

        return results;
    }
}

export const categoryService: CategoryService = new CategoryService();
