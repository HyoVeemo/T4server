import { Model, Table, Column, Comment, PrimaryKey, ForeignKey, AllowNull, CreatedAt, Unique, AutoIncrement } from "sequelize-typescript";
import Hospital from "./Hospital.model";
import User from "./User.model";

@Table
export default class Review extends Model<Review> {
    @Unique
    @AutoIncrement
    @Column
    reviewIndex: number;

    @PrimaryKey
    @ForeignKey(() => Hospital)
    @Column
    hpid: string;

    @PrimaryKey
    @ForeignKey(() => User)
    @Column
    userIndex: number;

    @Comment('게시글 내용')
    @Column
    contents: string;

    @AllowNull(true)
    @Column
    img: string;

    @PrimaryKey
    @CreatedAt
    @Column
    createdAt: Date;
}
