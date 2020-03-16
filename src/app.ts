import * as bodyParser from "body-parser";
//import logger from "morgan"; // Express 서버에서 발생하는 이벤트들 기록해주는 미들웨어.
import express from "express";
import { signRoute } from "./router/sign.route";
import { categoryRoute } from "./router/category.route";
import { hospitalRoute } from "./router/hospital.route";
import { reviewRoute } from './router/review.route';
import { hospitalSubscriberRoute } from './router/hospitalSubscriber.route';
import { verify } from './middleware/auth.middleware'
import Db from './db';


export class Server {
  public app: express.Application;
  public port: string | number;
  public env: boolean;
  public db: Db;

  constructor(configInfo) {
    this.app = express();
    this.db = new Db(configInfo);

    /**
    *  데이터베이스 연결 ( 설정 주의 )
    *  force:true  | DROPS ALL TABLE AND CREATE
    *        false  | CREATE IF NOT EXIST
    */
    this.db.sequelize.sync({force: false});

    this.initMiddlewares();
    this.setRouter();
  }

  private initMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    //this.app.use(logger('dev'));
  }

  private setRouter() {
    this.app.use(signRoute.signRouter);
    this.app.use(categoryRoute.categoryRouter);
    this.app.use(hospitalRoute.hospitalRouter);
  
    //로그인 후 사용 가능한 기능    
    this.app.use(verify);
    this.app.use(reviewRoute.reviewRouter);
    this.app.use(hospitalSubscriberRoute.hospitalSubscriberRouter);
  }
}