import { Table, Column, Model, IsEmail, CreatedAt, UpdatedAt, BelongsToMany, HasMany, Comment, Unique, AllowNull, PrimaryKey, AutoIncrement, DataType } from "sequelize-typescript";
import Review from "./Review.model";
import Hospital from "./Hospital.model";
import Reservation from "./Reservation.model";
import ReservationLog from "./ReservationLog.model";

@Table({
  tableName: "User",
  defaultScope: {
    attributes: [
      "userIndex",
      "userId",
      "userPw",
      "userName",
      "userNickName",
      "age",
      "gender",
      "tel",
      "email",
      "avartar"
    ]
  }
})
export default class User extends Model<User> {
  @BelongsToMany(() => Hospital, {
    through: {
      model: () => Review,
      unique: false
    }
  })
  hospital: Hospital[]; // 리뷰 등록한 병원

  @HasMany(() => Review)
  review: Review[];

  @HasMany(() => Reservation)
  reservation: Reservation[];

  @HasMany(() => Reservation)
  reservationLog: ReservationLog[];

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  userIndex: number;

  @AllowNull(false)
  @Unique(true)
  @Column(DataType.STRING)
  userId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  userPw: string;

  @Comment('실명')
  @AllowNull(false)
  @Column
  userName: string;

  @Comment('별명')
  @Unique
  @Column
  userNickName: string;

  @Column(DataType.INTEGER)
  age: number;

  @Column(DataType.STRING)
  gender: string;

  @Unique
  @Column(DataType.STRING)
  tel: string;

  @IsEmail
  @Unique
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  avartar: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}