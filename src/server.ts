import { Server } from "./app";
import { hospitalAPI } from './utils/hospitalApi.util'
import AWS from "aws-sdk";
AWS.config.update({ region: 'ap-northeast-2' });
(async function () {
  try {

    const credentials: AWS.SharedIniFileCredentials = new AWS.SharedIniFileCredentials();
    // ~/.aws/credentials 에 저장된 인증 정보 가져옴
    AWS.config.credentials = credentials; 
    const ssm: AWS.SSM = await new AWS.SSM();

    // Request
    // 정보를 얻고싶은 parameter 이름
    const params: any = { 
      Name: 'config', 
      WithDecryption: false
    };

    const data: AWS.SSM.GetParameterResult = await ssm.getParameter(params).promise();
    const configInfo = JSON.parse(data.Parameter.Value);
    //console.log({ configInfo });
    const port = Number(configInfo.PORT);

    const app = new Server(configInfo).app;
    await app.set("port", port);
    app
      .listen(app.get("port"), async () => {
        console.log("Server is running on", port);
      })
      .on("error", err => {
        console.error(err);
      });
      //hospitalAPI();
      
  } catch (err) {
    console.error(err);
  }
})();


