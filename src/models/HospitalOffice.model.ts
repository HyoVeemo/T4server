import { Model, Table, Column, AllowNull, BelongsTo, PrimaryKey, AutoIncrement, ForeignKey, HasMany } from "sequelize-typescript";
import Hospital from './Hospital.model';
import Reservation from './Reservation.model';
import Treatment from "./Treatment.model";

@Table
export default class HospitalOffice extends Model<HospitalOffice>{
    @BelongsTo(() => Hospital)
    hospital: Hospital

    @HasMany(() => Reservation)
    reservation: Reservation[]

    @HasMany(() => Treatment)
    treatment: Treatment;

    @PrimaryKey
    @AutoIncrement
    @Column
    officeIndex: number

    @ForeignKey(() => Hospital)
    @Column({
        unique: 'HospitalOffices_hpid_officeName_unique'
    })
    hpid: string

    @AllowNull(false)
    @Column({
        unique: 'HospitalOffices_hpid_officeName_unique'
    })
    officeName: string
}