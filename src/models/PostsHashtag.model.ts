import { Model, Table, Column, HasMany, AutoIncrement, DataType, BelongsTo, PrimaryKey, AllowNull, BelongsToMany, ForeignKey } from "sequelize-typescript";
import Hashtag from './Hashtag.model';

@Table({
    timestamps: false
})
export default class PostsHashtag extends Model<PostsHashtag>{
    @BelongsTo(()=>Hashtag)
    hashtag: Hashtag;

    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    PostsHashtagIndex: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    postsIndex:string;

    @AllowNull(false)
    @ForeignKey(()=>Hashtag)
    @Column({
        type: DataType.INTEGER
    })
    hashtagIndex:number;
}