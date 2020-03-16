import { Model, Default, ForeignKey, Table, Column, HasMany, Comment, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, DataType, AllowNull, BelongsToMany, NotNull } from "sequelize-typescript";
import User from "./User.model";
import Hospital from "./Hospital.model";

/**
 * Table: 병원 예약 로그
 */
@Table
export default class ReservationLog extends Model<ReservationLog>{
    @PrimaryKey
    @AutoIncrement
    @Column
    reservationLogIndex: number;

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

    @Default('INACTIVE')
    @Column
    status: string;

    @Column
    alterUserName: string;

    @Column
    alterAge: string;

    @Column
    alterTel: string;

    @Column
    alterEmail: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}