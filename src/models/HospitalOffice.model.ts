import { Model, Table, Column, Comment, BelongsTo, PrimaryKey, Unique, AutoIncrement, ForeignKey, HasMany } from "sequelize-typescript";
import Hospital from './Hospital.model';
import Reservation from './Reservation.model';

@Table
export default class HospitalOffice extends Model<HospitalOffice>{
    @BelongsTo(() => Hospital)
    hospital: Hospital

    @HasMany(() => Reservation)
    reservation: Reservation[]

    @PrimaryKey
    @AutoIncrement
    @Column
    officeIndex: number

    @ForeignKey(() => Hospital)
    @Column({
        unique: 'HospitalOffices_hpid_officeName_unique'
    })
    hpid: string

    @Column({
        unique: 'HospitalOffices_hpid_officeName_unique'
    })
    officeName: string
}