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
const User_model_1 = __importDefault(require("./User.model"));
const Hospital_model_1 = __importDefault(require("./Hospital.model"));
const HospitalOffice_model_1 = __importDefault(require("./HospitalOffice.model"));
/**
 * Table: 병원 예약
 */
let Reservation = class Reservation extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_model_1.default),
    __metadata("design:type", User_model_1.default)
], Reservation.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Hospital_model_1.default),
    __metadata("design:type", Hospital_model_1.default)
], Reservation.prototype, "hospital", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => HospitalOffice_model_1.default),
    __metadata("design:type", HospitalOffice_model_1.default)
], Reservation.prototype, "hospitalOffice", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Reservation.prototype, "reservationIndex", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => User_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Reservation.prototype, "userIndex", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Hospital_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Reservation.prototype, "hpid", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => HospitalOffice_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Reservation.prototype, "officeIndex", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Reservation.prototype, "reservationDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Reservation.prototype, "reservationTime", void 0);
__decorate([
    sequelize_typescript_1.Comment('예약현황: PENDING -> (병원에서 예약 확인 후) ACTIVE, (reservationTime이 지나거나, 예약 캔슬되면 INACTIVE -> Log로 이동'),
    sequelize_typescript_1.Default('PENDING'),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Reservation.prototype, "alterUserName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Reservation.prototype, "alterAge", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Reservation.prototype, "alterTel", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Reservation.prototype, "alterEmail", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Reservation.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Reservation.prototype, "updatedAt", void 0);
Reservation = __decorate([
    sequelize_typescript_1.Table
], Reservation);
exports.default = Reservation;
//# sourceMappingURL=Reservation.model.js.map