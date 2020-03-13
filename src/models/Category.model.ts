import { Model, Table, Column, HasMany, AutoIncrement, PrimaryKey, AllowNull, BelongsToMany } from "sequelize-typescript";
import Hospital from "./Hospital.model";
import HospitalCategory from "./HospitalCategory.model";
import Treatment from "./Treatment.model";

/**
 * Table: 진료과목
 * example: 내과, 청소년과, 신경과
 */
@Table({
  timestamps: false
})
export default class Category extends Model<HospitalCategory> {
  @BelongsToMany(
    () => Hospital,
    () => HospitalCategory,
    "dgid",
    "hpid"
  )
  hospital: Hospital[];

  @HasMany(() => Treatment)
  treatment: Treatment;

  @PrimaryKey
  @AutoIncrement
  @Column
  dgid: number;

  @AllowNull
  @Column
  hospitalCategoryName: string;
}
