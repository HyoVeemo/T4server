import * as bodyParser from "body-parser";
import logger from "morgan"; // Express 서버에서 발생하는 이벤트들 기록해주는 미들웨어.
import express from "express";
import { signRoute } from "./router/sign.route";
import { hospitalRoute } from "./router/hospital.route";
import { reviewRoute } from './router/review.route';
import { reservationRoute } from './router/reservation.route';
import { hospitalSubscriberRoute } from './router/hospitalSubscriber.route';
import { hospitalOfficeRoute } from './router/hospitalOffice.route';
import Db from './db';
import { searchRoute } from './router/search.route';
import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch'


export class Server {
  public app: express.Application;
  public port: string | number;
  public env: boolean;
  public db: Db;
  public client;

  constructor(configInfo) {
    this.app = express();
    this.db = new Db(configInfo);
    this.app.locals.sequelize = this.db.sequelize;
    this.app.locals.secret = configInfo.secret;
    this.app.locals.senderEmail = configInfo.senderEmail;
    this.app.locals.senderPw = configInfo.senderPw;

    this.client = new Client({ node: configInfo.ELASTIC_CLIENT });
    this.app.locals.client = this.client;

    /**
    *  데이터베이스 연결 ( 설정 주의 )
    *  force:true  | DROPS ALL TABLE AND CREATE
    *        false  | CREATE IF NOT EXIST
    */
    this.db.sequelize.sync({ force: false });

    this.initMiddlewares();
    this.setRouter();
  }

  private initMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(logger('dev'));
  }

  private setRouter() {
    this.app.use(signRoute.signRouter);
    this.app.use(hospitalRoute.hospitalRouter);
    this.app.use(hospitalOfficeRoute.hospitalOfficeRouter);
    this.app.use(reviewRoute.reviewRouter);
    this.app.use(reservationRoute.reservationRouter);
    this.app.use(hospitalSubscriberRoute.hospitalSubscriberRouter);
    this.app.use(searchRoute.searchRouter);
  }
}