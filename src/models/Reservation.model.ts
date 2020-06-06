import { Model, Default, ForeignKey, Table, Column, IsDate, BelongsTo, Comment, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, DataType, AllowNull, BelongsToMany, NotNull } from "sequelize-typescript";
import User from "./User.model";
import Hospital from "./Hospital.model";
import HospitalOffice from './HospitalOffice.model';
import Treatment from "./Treatment.model";

/**
 * Table: 병원 예약
 */
@Table
export default class Reservation extends Model<Reservation>{
    @BelongsTo(() => User, {
        onDelete: "CASCADE"
    })
    user: User;

    @BelongsTo(() => Hospital)
    hospital: Hospital;

    @BelongsTo(() => HospitalOffice)
    hospitalOffice: HospitalOffice;

    @BelongsTo(() => Treatment, {
        onDelete: "CASCADE"
    })
    treatment: Treatment;

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

    @ForeignKey(() => Treatment)
    @Column
    treatmentIndex: number;

    @Column
    treatmentName: string;

    @IsDate
    @AllowNull(false)
    @Column(DataType.STRING)
    reservationDate: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    reservationTime: string;

    @Comment('선생님께 하고 싶은 말')
    @Column
    comment: string;

    @Comment('진단서')
    @Column(DataType.TEXT)
    diagnosis: string;

    @Comment('예약현황: PENDING -> (병원에서 예약 수락 후) ACCEPTED, 거절하면 REFUSED, 예약 시간이 지나면 TIMEOUT')
    @Default('PENDING')
    @Column
    status: string;

    @Default(false)
    @Column
    deleted: boolean;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}