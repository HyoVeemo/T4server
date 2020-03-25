"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const morgan_1 = __importDefault(require("morgan")); // Express 서버에서 발생하는 이벤트들 기록해주는 미들웨어.
const express_1 = __importDefault(require("express"));
const sign_route_1 = require("./router/sign.route");
const category_route_1 = require("./router/category.route");
const hospital_route_1 = require("./router/hospital.route");
const review_route_1 = require("./router/review.route");
const reservation_route_1 = require("./router/reservation.route");
const hospitalSubscriber_route_1 = require("./router/hospitalSubscriber.route");
const auth_middleware_1 = require("./middleware/auth.middleware");
const db_1 = __importDefault(require("./db"));
class Server {
    constructor(configInfo) {
        this.app = express_1.default();
        this.db = new db_1.default(configInfo);
        this.app.locals.sequelize = this.db.sequelize;
        /**
        *  데이터베이스 연결 ( 설정 주의 )
        *  force:true  | DROPS ALL TABLE AND CREATE
        *        false  | CREATE IF NOT EXIST
        */
        this.db.sequelize.sync({ force: false });
        this.initMiddlewares();
        this.setRouter();
    }
    initMiddlewares() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(morgan_1.default('dev'));
    }
    setRouter() {
        this.app.use(sign_route_1.signRoute.signRouter);
        this.app.use(category_route_1.categoryRoute.categoryRouter);
        this.app.use(hospital_route_1.hospitalRoute.hospitalRouter);
        //로그인 후 사용 가능한 기능    
        this.app.use(auth_middleware_1.verify);
        this.app.use(review_route_1.reviewRoute.reviewRouter);
        this.app.use(reservation_route_1.reservationRoute.reservationRouter);
        this.app.use(hospitalSubscriber_route_1.hospitalSubscriberRoute.hospitalSubscriberRouter);
    }
}
exports.Server = Server;
//# sourceMappingURL=app.js.map