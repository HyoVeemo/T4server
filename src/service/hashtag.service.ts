import Hashtag from "../models/Hashtag.model";

interface IHashtagData{
    hashtagName: string
}

class HashtagService{
    constructor(){

    }

    async createHashtag(hashtagData: IHashtagData){
        let resultHashtag = await Hashtag.create(hashtagData);
        return resultHashtag;
    }

    async getHashtag(hashtagName:string){
        let resultHashtag = await Hashtag.findOne({
            where:{
                hashtagName
            }});
        return resultHashtag;
    }

    async listHashtag(filter?: any){
        let resultHashtag = await Hashtag.findAndCountAll();
        return resultHashtag;
    }

    async deleteHashtag(hashtagIndex:number){
        let resultHashtag = await Hashtag.destroy({
            where:{
                hashtagIndex: hashtagIndex
            }
        })
    }
}

export const hashtagService = new HashtagService();