import * as express from 'express'
import { categoryService } from '../service/category.service'

class CategoryRoute {
    public categoryRouter: express.Router = express.Router();
    constructor() {
        this.categoryRouter.get('/category', listCategory)
    }
}

async function listCategory(req, res): Promise<any> {
    try {
        const result = await categoryService.listCategory();
        res.send({
            success: true,
            statusCode: 200,
            result: result
        })
    } catch (err) {
        //console.log(err);
        res.send({
            success: false,
            statusCode: 500,
            message: 'listCategory: 500'
        })
    }
}

export const categoryRoute: CategoryRoute = new CategoryRoute();