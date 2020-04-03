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
const HospitalCategory_model_1 = __importDefault(require("./HospitalCategory.model"));
const Treatment_model_1 = __importDefault(require("./Treatment.model"));
/**
 * Table: 진료과목
 * example: 내과, 청소년과, 신경과
 */
let Category = class Category extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.BelongsToMany(() => Hospital_model_1.default, () => HospitalCategory_model_1.default, "dgid", "hpid"),
    __metadata("design:type", Array)
], Category.prototype, "hospital", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Treatment_model_1.default),
    __metadata("design:type", Treatment_model_1.default)
], Category.prototype, "treatment", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => HospitalCategory_model_1.default),
    __metadata("design:type", Array)
], Category.prototype, "hospitalCategory", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Category.prototype, "dgid", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Category.prototype, "hospitalCategoryName", void 0);
Category = __decorate([
    sequelize_typescript_1.Table({
        timestamps: false
    })
], Category);
exports.default = Category;
//# sourceMappingURL=Category.model.js.map