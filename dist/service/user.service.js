"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = __importDefault(require("../models/User.model"));
const bcryptjs_1 = require("bcryptjs");
const sequelize_1 = require("sequelize");
class UserService {
    constructor() {
    }
    /**
     * service: 유저 생성
     */
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = bcryptjs_1.hashSync(userData.userPw, 8);
            userData.userPw = hashedPassword;
            let resultUser = yield User_model_1.default.create(userData);
            return resultUser.toJSON();
        });
    }
    /**
     * service: 유저 조회
     */
    getUser(userArg) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultUser = yield User_model_1.default.findOne({
                where: {
                    [sequelize_1.Op.or]: [{ userId: userArg }, { userNickName: userArg }]
                }
            });
            return resultUser;
        });
    }
    /**
     * service: 로그인 정보 인증
     */
    validateUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            //유저 조회 
            let resultUser = yield this.getUser(userData.userId); // DB에서 일치하는 userData 가져옴.
            if (!resultUser) {
                throw new Error('user id does not exist');
            }
            const IsPasswordValid = bcryptjs_1.compareSync(userData.userPw, resultUser.userPw);
            if (!IsPasswordValid) {
                throw new Error('inValid password');
            }
            return resultUser.toJSON();
        });
    }
    /**
     * service: 유저 정보 업데이트
     */
    updateUser(userIndex, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userData.userPw) {
                const hashedPassword = bcryptjs_1.hashSync(userData.userPw, 8);
                userData.userPw = hashedPassword;
            }
            const result = yield User_model_1.default.update(userData, {
                where: {
                    userIndex: userIndex
                }
            });
            return result;
        });
    }
    /**
     * service: 유저 삭제
     */
    deleteUser(userIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User_model_1.default.destroy({
                where: {
                    userIndex: userIndex
                }
            });
        });
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map