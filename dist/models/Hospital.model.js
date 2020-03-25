"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Category_model_1 = __importDefault(require("./Category.model"));
const HospitalCategory_model_1 = __importDefault(require("./HospitalCategory.model"));
const User_model_1 = __importDefault(require("./User.model"));
const HospitalOffice_model_1 = __importDefault(require("./HospitalOffice.model"));
const Review_model_1 = __importDefault(require("./Review.model"));
const Reservation_model_1 = __importDefault(require("./Reservation.model"));
const ReservationLog_model_1 = __importDefault(require("./ReservationLog.model"));
let Hospital = class Hospital extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.BelongsToMany(() => Category_model_1.default, () => HospitalCategory_model_1.default, "hpid", "dgid"),
    __metadata("design:type", Array)
], Hospital.prototype, "category", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Review_model_1.default),
    __metadata("design:type", Array)
], Hospital.prototype, "review", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => HospitalOffice_model_1.default),
    __metadata("design:type", Array)
], Hospital.prototype, "hospitalOffice", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Reservation_model_1.default),
    __metadata("design:type", Array)
], Hospital.prototype, "reservation", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => ReservationLog_model_1.default),
    __metadata("design:type", Array)
], Hospital.prototype, "reservationLog", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => User_model_1.default, {
        through: {
            model: () => Review_model_1.default,
            unique: false
        }
    }),
    __metadata("design:type", Array)
], Hospital.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.Comment("기관 id"),
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "hpid", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Comment("기관명"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyName", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Comment("주소"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyAddr", void 0);
__decorate([
    sequelize_typescript_1.Comment("경도"),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], Hospital.prototype, "wgs84Lon", void 0);
__decorate([
    sequelize_typescript_1.Comment("위도"),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], Hospital.prototype, "wgs84Lat", void 0);
__decorate([
    sequelize_typescript_1.Comment("진료시작(월요일)"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyTime1", void 0);
__decorate([
    sequelize_typescript_1.Comment("진료시작(화요일)"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyTime2", void 0);
__decorate([
    sequelize_typescript_1.Comment("진료시작(수요일)"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyTime3", void 0);
__decorate([
    sequelize_typescript_1.Comment("진료시작(목요일)"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyTime4", void 0);
__decorate([
    sequelize_typescript_1.Comment("진료시작(금요일)"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyTime5", void 0);
__decorate([
    sequelize_typescript_1.Comment("진료시작(토요일)"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyTime6", void 0);
__decorate([
    sequelize_typescript_1.Comment("진료시작(일요일)"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyTime7", void 0);
__decorate([
    sequelize_typescript_1.Comment("진료시작(공휴일)"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyTime8", void 0);
__decorate([
    sequelize_typescript_1.Comment("대표전화"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyTel", void 0);
__decorate([
    sequelize_typescript_1.Comment("기관설명상세"),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Hospital.prototype, "dutyInf", void 0);
Hospital = __decorate([
    sequelize_typescript_1.Table
], Hospital);
exports.default = Hospital;
//# sourceMappingURL=Hospital.model.js.map