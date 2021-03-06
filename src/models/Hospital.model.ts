import { Model, Table, Column, Comment, BelongsToMany, PrimaryKey, DataType, AllowNull, HasMany, HasOne } from "sequelize-typescript";
import Category from "./Category.model";
import HospitalCategory from "./HospitalCategory.model";
import User from "./User.model";
import HospitalOffice from "./HospitalOffice.model";
import Review from "./Review.model";
import Reservation from "./Reservation.model";
import HospitalSubscriber from "./HospitalSubscriber.model";
import HospitalUser from "./HospitalUser.model";

@Table
export default class Hospital extends Model<Hospital> {
  @HasOne(() => HospitalUser)
  hospitalUser: HospitalUser

  @HasMany(() => HospitalSubscriber)
  hospitalSubscriber: HospitalSubscriber[]

  @BelongsToMany(
    () => Category,
    () => HospitalCategory,
    "hpid",
    "dgid"
  )
  category: Category[];

  @HasMany(() => Review)
  review: Review[];

  @HasMany(() => HospitalOffice)
  hospitalOffice: HospitalOffice[];

  @HasMany(() => Reservation)
  reservation: Reservation[];

  @BelongsToMany(() => User, {
    through: {
      model: () => Review,
      unique: false
    }
  })
  user: User[]; // 리뷰 쓴 사람

  @Comment("기관 id")
  @PrimaryKey
  @Column
  hpid: string;

  @AllowNull(false)
  @Comment("기관명")
  @Column
  dutyName: string;

  @AllowNull(false)
  @Comment("주소")
  @Column
  dutyAddr: string; // 주소 // 예: 서울특별시 강남구 일원동50 (일원로81)

  @Column
  dutyMapimg: string;

  @Comment("경도")
  @Column(DataType.FLOAT)
  wgs84Lon: number;

  @Comment("위도")
  @Column(DataType.FLOAT)
  wgs84Lat: number;

  @Comment("진료시작(월요일)")
  @Column
  dutyTime1: string;

  @Comment("진료시작(화요일)")
  @Column
  dutyTime2: string;

  @Comment("진료시작(수요일)")
  @Column
  dutyTime3: string;

  @Comment("진료시작(목요일)")
  @Column
  dutyTime4: string;

  @Comment("진료시작(금요일)")
  @Column
  dutyTime5: string;

  @Comment("진료시작(토요일)")
  @Column
  dutyTime6: string;

  @Comment("진료시작(일요일)")
  @Column
  dutyTime7: string;

  @Comment("진료시작(공휴일)")
  @Column
  dutyTime8: string;

  @Comment("대표전화")
  @Column
  dutyTel: string;

  @Comment("기관설명상세")
  @Column
  dutyInf: string;

  @AllowNull(true)
  @Column
  img: string;
}
