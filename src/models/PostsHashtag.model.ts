import { Model, Table, Column, HasMany, AutoIncrement, DataType, BelongsTo, PrimaryKey, AllowNull, BelongsToMany, ForeignKey } from "sequelize-typescript";
import Posts from './Posts.model';
import Hashtag from './Hashtag.model';

@Table({
    timestamps: false
})
export default class PostsHashtag extends Model<PostsHashtag>{
    @BelongsTo(()=>Posts)
    posts:Posts;
    @BelongsTo(()=>Hashtag)
    hashtag: Hashtag;

    
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    PostsHashtagIndex: number;


    @ForeignKey(()=>Posts)
    @Column({
        type: DataType.INTEGER
    })
    postsIndex:number;


    @ForeignKey(()=>Hashtag)
    @Column({
        type: DataType.INTEGER
    })
    hashtagIndex:number;
}