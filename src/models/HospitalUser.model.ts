import { Table, Column, Model, IsEmail, CreatedAt, UpdatedAt, BelongsTo, ForeignKey, Unique, AllowNull, PrimaryKey, AutoIncrement, DataType } from "sequelize-typescript";
import Hospital from "./Hospital.model";

@Table
export default class HospitalUser extends Model<HospitalUser> {
    @BelongsTo(() => Hospital)
    hospital: Hospital;

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    hospitalUserIndex: number;

    @AllowNull(false)
    @ForeignKey(() => Hospital)
    @Column
    hpid: string;

    @AllowNull(false)
    @IsEmail
    @Unique
    @Column(DataType.STRING)
    email: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    hospitalUserPw: string;

    @Unique
    @Column(DataType.STRING)
    tel: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}