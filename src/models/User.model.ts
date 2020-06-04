import { Table, Column, Model, IsEmail, Default, CreatedAt, UpdatedAt, BelongsToMany, HasMany, Comment, Unique, AllowNull, PrimaryKey, AutoIncrement, DataType } from "sequelize-typescript";
import Review from "./Review.model";
import Hospital from "./Hospital.model";
import Reservation from "./Reservation.model";

@Table({
  defaultScope: {
    attributes: [
      "userIndex",
      "email",
      "emailVerified",
      "userPw",
      "snsId",
      "provider",
      "userName",
      "userNickName",
      "age",
      "gender",
      "tel",
      'kakaoUserToken',
      "playerId"
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

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  userIndex: number;

  @IsEmail
  @Unique
  @Column(DataType.STRING)
  email: string;

  @Default(false)
  @Column
  emailVerified: boolean;

  @Column
  keyForVerify: string;

  @Column(DataType.STRING)
  userPw: string;

  @Unique
  @Column(DataType.STRING(40))
  snsId: string;

  @Default('local')
  @Column(DataType.STRING(20))
  provider: string;

  @Unique
  @Column
  kakaoUserToken: string;

  @Comment('실명')
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

  @Unique
  @Column(DataType.STRING(50))
  playerId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}