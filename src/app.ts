import * as bodyParser from "body-parser";
import logger from "morgan"; // Express 서버에서 발생하는 이벤트들 기록해주는 미들웨어.
import express from "express";
import { signRoute } from "./router/sign.route";
import { hospitalRoute } from "./router/hospital.route";
import { reviewRoute } from './router/review.route';
import { reservationRoute } from './router/reservation.route';
import { hospitalSubscriberRoute } from './router/hospitalSubscriber.route';
import { hospitalOfficeRoute } from './router/hospitalOffice.route';
import { hospitalManagementRoute } from './router/hospitalManagement.route';
import { kakaoUserRoute } from './router/kakaoUser.route';
import { searchRoute } from './router/search.route';
import { Client } from '@elastic/elasticsearch'
import { postsRoute } from "./router/posts.route";
import { hashtagRoute } from "./router/hashtag.route";
import Db from './db';
import cors from 'cors';


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
    this.app.locals.APP_ID = configInfo.APP_ID;
    this.app.locals.API_KEY = configInfo.API_KEY;

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
    this.app.use(cors());
    this.app.use(logger('dev'));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
  }

  private setRouter() {
    this.app.use(signRoute.signRouter);
    this.app.use(kakaoUserRoute.kakaoUserRouter);
    this.app.use(hospitalRoute.hospitalRouter);
    this.app.use(hospitalOfficeRoute.hospitalOfficeRouter);
    this.app.use(reviewRoute.reviewRouter);
    this.app.use(postsRoute.postsRouter);
    this.app.use(reservationRoute.reservationRouter);
    this.app.use(hospitalSubscriberRoute.hospitalSubscriberRouter);
    this.app.use(searchRoute.searchRouter);
    this.app.use(hospitalManagementRoute.hospitalManagementRouter);
    this.app.use(hashtagRoute.hashtagRouter);
  }
}