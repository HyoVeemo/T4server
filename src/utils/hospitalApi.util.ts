import * as convert from 'xml-js'
import request from "request-promise-native";
import Hospital from "../models/Hospital.model";
import Category from "../models/Category.model";

export async function hospitalAPI() {
  try {
    const host1: string = 'http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncListInfoInqire'; // 모든 병원 데이터 가져옴
    const host2: string = 'http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlBassInfoInqire'; // 한 병원 데이터 가져옴
    const SERVICE_KEY: string = 'I2F%2B1Oce6drCgGSm33cvy%2F3uLnHQ4BY46ALKDYUbKqPqslTOBJTUzx1yH%2FPt%2FsnttC0mZeVuTudJWDJ70xLCnw%3D%3D';
    const queryString1: string = `?Q0=${encodeURIComponent(
      "서울특별시"
    )}&Q1=${encodeURIComponent(
      "성북구"
    )}&pageNo=1&numOfRows=1000&ServiceKey=${SERVICE_KEY}`;
    const requestUrl1: string = host1 + queryString1;
    const result1 = await request.get(requestUrl1);
    const xmlToJson = convert.xml2json(result1, {
      compact: true,
      spaces: 4
    });
    const jsonObj = JSON.parse(xmlToJson);
    const hospitalArr = jsonObj.response.body.items.item;
    const keys = Object.keys(hospitalArr); // 병원 개수
    let hospitalList;
    for (const key in keys) {
      const queryString2: string = `?HPID=${hospitalArr[key].hpid._text}&ServiceKey=${SERVICE_KEY}`;
      const requestUrl2: string = host2 + queryString2;
      const result2 = await request.get(requestUrl2);
      const xmlToJson2 = convert.xml2json(result2, {
        compact: true,
        spaces: 4
      });
      const jsonObj2 = JSON.parse(xmlToJson2);
      const hspiInf = jsonObj2.response.body.items.item;
      const hspi_keys = Object.keys(hspiInf); // 병원 상세 정보 키들
      let hspiCategory = []; // 병원 각각의 카테고리(mysql에 저장돼있는 카테고리들 한정)

      if (hspi_keys[0] === "dgidIdName") {
        const str = jsonObj2.response.body.items.item.dgidIdName._text;
        /* 카테고리들 배열에 집어넣기. */
        const categories = str.split(",");
        const categoryArr = []; // 각 병원의 카테고리(요청 받아 온 카테고리들)
        for (let c of categories) {
          if (c === '치료방사선과' || c === '임상병리과' || c === '해부병리과' || c === '핵의학과') {
            c = '기타';
          } else if (c === '사상체질과' || c === '침구과' || c === '한방내과' || c === '한방부인과' || c === '한방소아과' || c === '한방신경정신과' || c === '한방안이비인후피부과' || c === '한방재활의학과' || c === '한방응급과') {
            c = '한의원';
          } else if (c === '구강내과' || c === '구강병리과' || c === '구강악안면방사선과' || c === '소아치과' || c === '예방치과' || c === '치과교정과' || c === '치과보존과' || c === '치과보철과' || c === '치주과') {
            c = '치과';
          }
          categoryArr.push(c);
        }
        for (const cn of categoryArr) {
          const category = await Category.findAll({
            where: { HospitalCategoryName: cn } // 카테고리 테이블에서 일치하는 카테고리 로우 전부 찾아서 가져오기.
          });
          if (category[0] && category[0]["dataValues"]) {
            hspiCategory.push(category[0]["dataValues"].dgid); // 외래키(dgid)로 테이블끼리 관계 맺기 위함.
          }
        }
      } else {
        hspiCategory.push(0);
      }

      hspiCategory = hspiCategory.filter((item, index) => { // 배열 중복 제거.
        return hspiCategory.indexOf(item) === index;
      });

      let arr = Object.keys(hospitalArr[key]); // 병원 목록에 들어있는 키들.
      let arr2 = [];
      for (const x of arr) {
        if (x.slice(0, 8) === "dutyTime") arr2.push(x);
        if (x.slice(0, 5) === "wgs84") arr2.push(x);
        if (x.slice(0, 7) === "dutyInf") arr2.push(x);
        if (x.slice(0, 10) === "dutyMapimg") arr2.push(x);
      }

      const obj = {};
      const obj2 = [
        "dutyTime1c",
        "dutyTime1s",
        "dutyTime2c",
        "dutyTime2s",
        "dutyTime3c",
        "dutyTime3s",
        "dutyTime4c",
        "dutyTime4s",
        "dutyTime5c",
        "dutyTime5s",
        "dutyTime6c",
        "dutyTime6s",
        "dutyTime7c",
        "dutyTime7s",
        "dutyTime8c",
        "dutyTime8s",
        "wgs84Lon",
        "wgs84Lat",
        "dutyInf",
        "dutyMapimg"
      ];

      for (var s = 1; s < obj2.length; s += 2) {
        if (arr2.indexOf(obj2[s]) !== -1) {
          if (obj2[s] === "wgs84Lat") {
            obj[obj2[s]] = hospitalArr[key].wgs84Lat._text;
          } else if (obj2[s] === "dutyMapimg") {
            obj[obj2[s]] = hospitalArr[key].dutyMapimg._text;
          } else {
            obj[obj2[s]] = `${hospitalArr[key][obj2[s]]._text.slice(
              0,
              2
            )}:${hospitalArr[key][obj2[s]]._text.slice(2, 4)}`;
          }
        } else {
          obj[obj2[s]] = null; // 예 : obj["dutyTime8c"] = null
        }
      }
      for (var c = 0; c < obj2.length; c += 2) {
        if (arr2.indexOf(obj2[c]) !== -1) {
          if (obj2[c] === "wgs84Lon") {
            obj[obj2[c]] = hospitalArr[key].wgs84Lon._text;
          } else if (obj2[c] === "dutyInf") {
            obj[obj2[c]] = hospitalArr[key].dutyInf._text;
          } else {
            obj[obj2[c]] = `${hospitalArr[key][obj2[c]]._text.slice(
              0,
              2
            )}:${hospitalArr[key][obj2[c]]._text.slice(2, 4)}`;
          }
        } else {
          obj[obj2[c]] = null; // 예 : obj["dutyTime8c"] = null
        }
      }

      hospitalList = await Hospital.create({
        hpid: hospitalArr[key].hpid._text,
        dutyName: hospitalArr[key].dutyName._text,
        dutyAddr: hospitalArr[key].dutyAddr._text,
        dutyMapimg: obj["dutyMapimg"],
        wgs84Lon: obj["wgs84Lon"],
        wgs84Lat: obj["wgs84Lat"],
        dutyTime1: `${obj["dutyTime1s"]}~${obj["dutyTime1c"]}`,
        dutyTime2: `${obj["dutyTime2s"]}~${obj["dutyTime2c"]}`,
        dutyTime3: `${obj["dutyTime3s"]}~${obj["dutyTime3c"]}`,
        dutyTime4: `${obj["dutyTime4s"]}~${obj["dutyTime4c"]}`,
        dutyTime5: `${obj["dutyTime5s"]}~${obj["dutyTime5c"]}`,
        dutyTime6: `${obj["dutyTime6s"]}~${obj["dutyTime6c"]}`,
        dutyTime7: `${obj["dutyTime7s"]}~${obj["dutyTime7c"]}`,
        dutyTime8: `${obj["dutyTime8s"]}~${obj["dutyTime8c"]}`,
        dutyTel: hospitalArr[key].dutyTel1._text,
        dutyInf: obj["dutyInf"]
      });
      await hospitalList.$add("category", hspiCategory);
    }
  } catch (error) {
    console.error(error);
  }
} 