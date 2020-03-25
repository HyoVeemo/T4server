import { Model, Default, ForeignKey, Table, Column, BelongsTo, Comment, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, DataType, AllowNull, BelongsToMany, NotNull } from "sequelize-typescript";
import User from "./User.model";
import Hospital from "./Hospital.model";
import HospitalOffice from './HospitalOffice.model';
import { any } from "bluebird";

/**
 * Table: 병원 예약
 */
@Table
export default class Reservation extends Model<Reservation>{
    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Hospital)
    hospital: Hospital;

    @BelongsTo(() => HospitalOffice)
    hospitalOffice: HospitalOffice;

    @PrimaryKey
    @AutoIncrement
    @Column
    reservationIndex: number;

    @ForeignKey(() => User)
    @Column
    userIndex: number;

    @ForeignKey(() => Hospital)
    @Column
    hpid: string;

    @ForeignKey(() => HospitalOffice)
    @Column
    officeIndex: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    reservationDate: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    reservationTime: string;

    @Comment('예약현황: PENDING -> (병원에서 예약 확인 후) ACTIVE, (reservationTime이 지나거나, 예약 캔슬되면 INACTIVE -> Log로 이동')
    @Default('PENDING')
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