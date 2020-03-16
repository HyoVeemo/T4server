<<<<<<< HEAD
import { Model, Table, Column, Comment, PrimaryKey, ForeignKey, AllowNull, CreatedAt, Unique, AutoIncrement, DataType } from "sequelize-typescript";
=======
import { Model, Table, Column, DataType, Comment, PrimaryKey, ForeignKey, AllowNull, CreatedAt, Unique, AutoIncrement, BelongsTo } from "sequelize-typescript";
>>>>>>> 2d7842604605ae8ecf5e0890792f1e0d3260e0ea
import Hospital from "./Hospital.model";
import User from "./User.model";

@Table
export default class Review extends Model<Review> {
    @Unique
    @AutoIncrement
    @Column
    reviewIndex: number;

    @BelongsTo(() => Hospital)
    hospital: Hospital;

    @PrimaryKey
    @ForeignKey(() => Hospital)
    @Column
    hpid: string;

    @BelongsTo(() => User)
    user: User;

    @PrimaryKey
    @ForeignKey(() => User)
    @Column
    userIndex: number;

    @Comment('게시글 내용')
<<<<<<< HEAD
    @Column(DataType.TEXT)
=======
    @Column(DataType.TEXT) // 게시글은 무슨 타입이지??
>>>>>>> 2d7842604605ae8ecf5e0890792f1e0d3260e0ea
    contents: string;

    @AllowNull(true)
    @Column
    img: string;

    @Comment('별점')
    @AllowNull(false)
    @Column(DataType.INTEGER)
    rating: number;

    @PrimaryKey
    @CreatedAt
    @Column
    createdAt: Date;
}
