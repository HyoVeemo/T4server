import { Model, Table, Column, HasMany, AutoIncrement, BelongsTo, PrimaryKey, AllowNull, BelongsToMany, ForeignKey, DataType } from "sequelize-typescript";
import PostsHashtag from "./PostsHashtag.model";

@Table({
    timestamps:false
})
export default class Hashtag extends Model<Hashtag>{
    @HasMany(()=>PostsHashtag)
    postsHashtag: PostsHashtag;

    @PrimaryKey
    @AutoIncrement
    @Column({
        type:DataType.INTEGER
    })
    hashtagIndex: number;

    @AllowNull(false)
    @Column({
        type:DataType.STRING
    })
    hashtagName: string;

}