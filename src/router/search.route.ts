import express from 'express';
import * as convert from 'xml-js'
import request from "request-promise-native";

class SearchRoute {
    public searchRouter: express.Router = express.Router();

    constructor() {
        this.searchRouter.get('/store/hospitals', storeHospital);
        this.searchRouter.get('/search/content/:content', searchHospital);
    }
}

async function storeHospital(req, res) {
    const host: string = 'http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncListInfoInqire'; // 모든 병원 데이터 가져옴
    const SERVICE_KEY: string = 'I2F%2B1Oce6drCgGSm33cvy%2F3uLnHQ4BY46ALKDYUbKqPqslTOBJTUzx1yH%2FPt%2FsnttC0mZeVuTudJWDJ70xLCnw%3D%3D';
    // const queryString: string = `?Q0=${encodeURIComponent(
    //     "서울특별시"
    // )}&Q1=${encodeURIComponent(
    //     "성북구"
    // )}&pageNo=1&numOfRows=1000&ServiceKey=${SERVICE_KEY}`;
    const queryString: string = `?Q0=${encodeURIComponent(
        "서울특별시"
    )}&pageNo=1&numOfRows=20000&ServiceKey=${SERVICE_KEY}`;
    const requestUrl: string = host + queryString;
    const result = await request.get(requestUrl); // <- 요청 보냄
    const xmlToJson = convert.xml2json(result, {
        compact: true,
        spaces: 1
    });
    const jsonObj = JSON.parse(xmlToJson);
    const hspiInf = jsonObj.response.body.items.item;
    const client = req.app.locals.client;
    try {
        for (const hi of hspiInf) {
            await client.index({
                index: 'hospitals',
                body: JSON.stringify(hi)
            });
        }
        res.send({
            message: 'Post succeeded'
        })
    } catch (err) {
        console.error(err);
        res.send({
            message: 'Post failed'
        })
    }
}

async function searchHospital(req, res): Promise<void> {
    const content = req.params.content;
    const params = {
        index: 'hospitals',
        body: {
            query: {
                match: {
                    'dutyName._text.nori': content
                }
            }
        }
    }
    const client = req.app.locals.client;

    try {
        const { body } = await client.search(params)

        res.send({
            message: 'Search succeeded',
            result: body.hits.hits
        })
    } catch (err) {
        console.error(err);
        res.send({
            message: 'Search failed'
        })
    }
}

export const searchRoute = new SearchRoute();