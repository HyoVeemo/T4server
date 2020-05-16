import PostsHashtag from '../models/PostsHashtag.model'
import Hashtag from '../models/Hashtag.model';

interface ICreatePostsData{
    postsIndex: number,
    hashtagIndex: number
}

class PostsHashtagService{
    constructor(){

    }
    async createPostsHashtag(postsHashtagData: any): Promise<any>{
        let resultPostsHashtag = await PostsHashtag.create(postsHashtagData);
        return resultPostsHashtag.toJSON();
    }

    async getPostsHashtagByHashtag(hashtagIndex: number):Promise<any>{
        let result = await PostsHashtag.findAll({
            where:{
                hashtagIndex: hashtagIndex
            }
        })
        return result;
    };
}