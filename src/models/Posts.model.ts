import { Model, Table, Column, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, DataType } from "sequelize-typescript";

@Table
export default class Posts extends Model<Posts>{

    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    postsIndex: number

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
