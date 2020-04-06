import { Model, Table, Column, Comment, BelongsTo, PrimaryKey, AllowNull, ForeignKey, AutoIncrement } from "sequelize-typescript";
import HospitalOffice from "./HospitalOffice.model";

/**
 * Table: 진료항목
 * example: 외이염, 감기, 충치, 신경치료...
 */
@Table({
  timestamps: false
})
export default class Treatment extends Model<Treatment> {
  @BelongsTo(() => HospitalOffice)
  office: HospitalOffice;

  @PrimaryKey
  @AutoIncrement
  @Column
  treatmentIndex: number;

  @ForeignKey(() => HospitalOffice)
  @Column({
    unique: 'Treatment_officeIndex_treatmentName_unique'
  })
  officeIndex: number;

  @AllowNull
  @Comment("진료항목명")
  @Column({
    unique: 'Treatment_officeIndex_treatmentName_unique'
  })
  treatmentName: string;
}
