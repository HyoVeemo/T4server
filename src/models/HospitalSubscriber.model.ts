import { Model, ForeignKey, Table, Column, HasMany, Comment, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, DataType, AllowNull, BelongsToMany } from "sequelize-typescript";
import User from "./User.model";
import Hospital from "./Hospital.model";

/**
 * Table: 병원 즐겨찾기
 */
@Table
export default class HospitalSubscriber extends Model<HospitalSubscriber>{
    @PrimaryKey
    @AutoIncrement
    @Column
    hospitalSubscriberIndex:number;

    @ForeignKey(()=>User)
    @Column
    userIndex: number;

    @ForeignKey(()=>Hospital)
    @Column
    hpid: string;

    @Column(DataType.INTEGER)
    isGood: number;

    @CreatedAt
    CreatedAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
}
