import { Model, ForeignKey, Table, Column, HasMany, Comment, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, DataType, AllowNull, BelongsToMany, BelongsTo } from "sequelize-typescript";
import User from "./User.model";
import Hospital from "./Hospital.model";

/**
 * Table: 병원 즐겨찾기
 */
@Table
export default class HospitalSubscriber extends Model<HospitalSubscriber>{
    @BelongsTo(() => Hospital)
    hospital: Hospital

    @PrimaryKey
    @AutoIncrement
    @Column
    hospitalSubscriberIndex: number;

    @ForeignKey(() => User)
    @Column
    userIndex: number;

    @ForeignKey(() => Hospital)
    @Column
    hpid: string;

    @Column(DataType.INTEGER)
    isScrap: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}