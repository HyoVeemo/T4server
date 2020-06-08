import * as bodyParser from "body-parser";
import logger from "morgan";
import express from "express";
import Db from './db';
import { Client } from '@elastic/elasticsearch';
import cors from 'cors';
import forceSSL from 'express-force-ssl';
import { signRoute } from "./router/sign.route";
import { hospitalRoute } from "./router/hospital.route";
import { reviewRoute } from './router/review.route';
import { reservationRoute } from './router/reservation.route';
import { hospitalSubscriberRoute } from './router/hospitalSubscriber.route';
import { hospitalOfficeRoute } from './router/hospitalOffice.route';
import { hospitalManagementRoute } from './router/hospitalManagement.route';
import { kakaoUserRoute } from './router/kakaoUser.route';
import { searchRoute } from './router/search.route';
import { postsRoute } from "./router/posts.route";
import { hashtagRoute } from "./router/hashtag.route";

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
    this.app.use(cors()); // cors 미들웨어 추가
    this.app.use(logger('dev'));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use('/',express.static('public'));
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