import { Model, Table, Column, Comment, BelongsTo, PrimaryKey, AllowNull, ForeignKey } from "sequelize-typescript";
import Category from "./Category.model";

/**
 * Table: 진료항목
 * example: 외이염, 감기, 충치, 신경치료...
 */
@Table({
  timestamps: false
})
export default class Treatment extends Model<Treatment> {
  @BelongsTo(() => Category)
  category: Category;

  @PrimaryKey
  @ForeignKey(() => Category)
  @Column
  dgid: number;

  @PrimaryKey
  @AllowNull
  @Comment("진료과목명")
  @Column
  treatmentName: string;
}
