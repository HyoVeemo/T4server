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
const Hospital_model_1 = __importDefault(require("./Hospital.model"));
const User_model_1 = __importDefault(require("./User.model"));
let Review = class Review extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Unique,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Review.prototype, "reviewIndex", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Hospital_model_1.default),
    __metadata("design:type", Hospital_model_1.default)
], Review.prototype, "hospital", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.ForeignKey(() => Hospital_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Review.prototype, "hpid", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_model_1.default),
    __metadata("design:type", User_model_1.default)
], Review.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.ForeignKey(() => User_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Review.prototype, "userIndex", void 0);
__decorate([
    sequelize_typescript_1.Comment('게시글 내용'),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT) // 게시글은 무슨 타입이지??
    ,
    __metadata("design:type", String)
], Review.prototype, "contents", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Review.prototype, "img", void 0);
__decorate([
    sequelize_typescript_1.Comment('별점'),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.CreatedAt,
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
Review = __decorate([
    sequelize_typescript_1.Table
], Review);
exports.default = Review;
//# sourceMappingURL=Review.model.js.map