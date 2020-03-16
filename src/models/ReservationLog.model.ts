import { Model,Default, ForeignKey, Table, Column, HasMany, Comment, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, DataType, AllowNull, BelongsToMany, NotNull } from "sequelize-typescript";
import User from "./User.model";
import Hospital from "./Hospital.model";

/**
 * Table: 병원 예약 로그
 */
@Table
export default class Reservation extends Model<Reservation>{
    @PrimaryKey
    @AutoIncrement
    @Column
    reservationLogIndex:number;

    @AllowNull(false)
    @Column
    userIndex: number;

    @AllowNull(false)
    @Column
    hpid: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    reservationDate: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    reservationTime: string;

    @AllowNull(false)
    @Comment('예약현황')
    @Column(DataType.STRING)
    status: string;

    @Column
    @Column(DataType.STRING)
    userName: string;

    @Column
    @Column(DataType.STRING)
    age: string;
    
    @Column
    @Column(DataType.STRING)
    tel: string;
    
    @Column
    @Column(DataType.STRING)
    email: string;
        
    @CreatedAt
    CreatedAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
}