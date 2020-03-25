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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const hospital_service_1 = require("../service/hospital.service");
const auth_util_1 = require("../utils/auth.util");
class HospitalRoute {
    constructor() {
        this.hospitalRouter = express.Router();
        this.hospitalRouter.get('/hospital/:hpid', getHospital);
        this.hospitalRouter.get('/hospital', pageListHospital);
        this.hospitalRouter.get('/debug', loginTest);
    }
}
function loginTest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = auth_util_1.auth(req);
            console.log(token);
            res.send({
                success: true,
                statusCode: 200,
                result: token
            });
        }
        catch (err) {
            console.log(err);
            res.send({
                success: false,
                statusCode: 500,
                message: 'getHospital: 500'
            });
        }
    });
}
function getHospital(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let hpid = req.params.hpid;
        const sequelize = req.app.locals.sequelize;
        try {
            const result = yield hospital_service_1.hospitalService.getHospital(hpid, sequelize);
            res.send({
                success: true,
                statusCode: 200,
                result: result
            });
        }
        catch (err) {
            console.log(err);
            res.send({
                success: false,
                statusCode: 500,
                message: 'getHospital: 500'
            });
        }
    });
}
function pageListHospital(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { filter, order, pn } = req.query;
            const result = yield hospital_service_1.hospitalService.pageListHospital(filter, order, pn);
            res.send({
                success: true,
                statusCode: 200,
                result: result,
                message: 'pageListHospital'
            });
        }
        catch (err) {
            console.log(err);
            res.send({
                success: false,
                statusCode: 500,
                message: 'pageListHospital: 500'
            });
        }
    });
}
exports.hospitalRoute = new HospitalRoute();
//# sourceMappingURL=hospital.route.js.map