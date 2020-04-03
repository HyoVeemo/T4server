import { Model, Table, Column, PrimaryKey, BelongsTo, ForeignKey } from "sequelize-typescript";
import Hospital from "./Hospital.model";
import Category from "./Category.model";

@Table
export default class HospitalCategory extends Model<HospitalCategory> {
  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => Hospital)
  @Column
  hpid: string;

  @ForeignKey(() => Category)
  @Column
  dgid: number;
}
