import { Model,Default, ForeignKey, Table, Column, HasMany, Comment, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, DataType, AllowNull, BelongsToMany, NotNull } from "sequelize-typescript";
import User from "./User.model";
import Hospital from "./Hospital.model";
import { any } from "bluebird";

/**
 * Table: 병원 예약
 */
@Table
export default class Reservation extends Model<Reservation>{
    @PrimaryKey
    @AutoIncrement
    @Column
    reservationIndex:number;

    @ForeignKey(()=>User)
    @AllowNull(false)
    @Column
    userIndex: number;

    @ForeignKey(()=>Hospital)
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
    @Comment('예약현황: PENDING,ACTIVE,INACTIVE')
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