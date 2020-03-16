import { Model, Table, Column, Comment, BelongsTo, PrimaryKey, DataType, AutoIncrement, ForeignKey } from "sequelize-typescript";
import Hospital from './Hospital.model'

@Table
export default class Office extends Model<Office>{
    @BelongsTo(() => Hospital)
    hospital: Hospital

    @PrimaryKey
    @AutoIncrement
    @Column
    officeId: number

    @PrimaryKey
    @ForeignKey(() => Hospital)
    @Column
    hpid: string

    @Column
    officeName: string
}