import { Op } from 'sequelize'
import Posts from '../models/Posts.model'

interface ICreatePostsData{ 
    title: string,
    url?: string,
    img?:string, 
}
interface IUpdatePostsData{
    title?:string,
    url?:string,
    img?:string
}
interface IStorePostsData{
    postsIndex: number, 
    title: string,
    url?:string,
    img?:string
}

class PostsService {
    constructor(){

    }

    async createPosts(postsData: ICreatePostsData):Promise<any>{
        let resultPosts = await Posts.create(postsData);
        return resultPosts.toJSON();
    }

    async listPostsCount(filter?:any){
        let PostsWhere: any = {};
        if(filter){
            if(filter.title){
                PostsWhere.title = filter.title
            }
            if(filter.content){
                PostsWhere.content = filter.content
            }
        }
        let PostsWhereOption: any = {
            [Op.or]: [
                {
                    title: {[Op.like]:PostsWhere.title}
                },
                {
                    content: {[Op.like]: PostsWhere.content}
                }
            ]
        }
    
        let options: any = {};
        options.where = PostsWhereOption;
      
        let result = await Posts.findAndCountAll(options);
        return result.count;
    }
    
    async listPosts(filter?:any, pn?:any){
    
        // const query = `SELECT 
        // * 
        // FROM Posts
        // WHERE title LIKE '%:title%' OR content LIKE '%:content'
        // ORDER BY createdAt DESC
        // LIMIT :offset, :limit`
        // const values = {
        //     title: filter.title, 
        //     content: filter.content
        // }
    }

    async getPosts(postsIndex: number){
        let result = await Posts.findOne({
            where: {
                postsIndex:postsIndex
            }
        })
        return result;
    }

    async updatePosts(postsData:IUpdatePostsData, postsIndex: number){
        let result = await Posts.update(postsData, {
            where: {
                postsIndex: postsIndex
            }
        })
        return result;
    }
    async deletePosts(postsIndex: number){
        let result = await Posts.destroy({
            where: {
                postsIndex: postsIndex
            }
        })

        return result;
    }


}

export const postsService: PostsService = new PostsService();
