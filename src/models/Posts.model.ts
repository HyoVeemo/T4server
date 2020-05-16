import { Model, ForeignKey, Table, Column, HasMany, Comment, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, DataType, AllowNull, BelongsToMany, BelongsTo } from "sequelize-typescript";
import User from './User.model'
import PostsHashtag from "./PostsHashtag.model";

@Table
export default class Posts extends Model<Posts>{    
    @HasMany(()=>PostsHashtag)
    postsHashtag:PostsHashtag;


    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    postsIndex:number

    @Column({
        type: DataType.TEXT
    })
    img: string;

    @Column({
        type: DataType.TEXT
    })
    url: string;
    
    @Column({
        type: DataType.STRING
    })
    title: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
