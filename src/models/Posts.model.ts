import { Model, ForeignKey, Table, Column, HasMany, Comment, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, DataType, AllowNull, BelongsToMany, BelongsTo } from "sequelize-typescript";
import User from './User.model'

@Table
export default class Posts extends Model<Posts>{    
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
    content: string;
    
    @Column({
        type: DataType.STRING
    })
    title: string;

    @Column({
        type: DataType.INTEGER
    })
    goodCount: string;
    

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
