import PostsHashtag from '../models/PostsHashtag.model'
import Hashtag from '../models/Hashtag.model';
import { hashtagService } from './hashtag.service';

interface ICreatePostsData{
    postsIndex: string,
    hashtagIndex: number
}

class PostsHashtagService{
    constructor(){

    }
    async createPostsHashtag(postsHashtagData: any){
        let resultPostsHashtag = await PostsHashtag.create(postsHashtagData);
        return resultPostsHashtag;
    }

    async getPostsHashtagByHashtag(hashtagIndex: number){
        let result = await PostsHashtag.findAll({
            where:{
                hashtagIndex: hashtagIndex
            }
        })
        return result;
    };
    async getPostsHashtagByPostsId(postsId:string){
        let result = await PostsHashtag.findAndCountAll({
            where:{
                postsIndex: postsId
            }
        })
        let results = []
        for(const row of result.rows){
            results.push(row.toJSON());
        }
        return results;
    };

    async deletePostsHashtag(postsId:string){
        let result = await this.getPostsHashtagByPostsId(postsId);

        await PostsHashtag.destroy({
            where:{
                postsIndex: postsId
            }
        })
        
        for(const row of result){
            let count = await this.getPostsHashtagByHashtag(row.hashtagIndex);
            console.log(count);
            if(count.length<1){
                await hashtagService.deleteHashtag(row.hashtagIndex);
            }
        }

        return result;
    }
}

export const postsHashtagService: PostsHashtagService = new PostsHashtagService();
