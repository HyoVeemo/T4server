import { Model, Default, BelongsTo, ForeignKey, Table, Column, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, DataType, AllowNull } from "sequelize-typescript";
import User from "./User.model";
import Hospital from "./Hospital.model";
import HospitalOffice from './HospitalOffice.model';

/**
 * Table: 병원 예약 로그
 */
@Table
export default class ReservationLog extends Model<ReservationLog>{
    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Hospital)
    hospital: Hospital;

    @BelongsTo(() => HospitalOffice)
    hospitalOffice: HospitalOffice;

    @PrimaryKey
    @AutoIncrement
    @Column
    reservationLogIndex: number;

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