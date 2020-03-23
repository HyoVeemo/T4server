import { Model, Table, Column, DataType, Comment, PrimaryKey, ForeignKey, AllowNull, CreatedAt, Unique, AutoIncrement, BelongsTo } from "sequelize-typescript";
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
    @Column(DataType.TEXT)
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
