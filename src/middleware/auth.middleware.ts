import * as jwt from 'jsonwebtoken'
import * as express from 'express'
import { jwtToken } from '../utils/jwt.util'


/**
 * middleWare: header에서 token 을 받아 검증
 * @param req 
 * @param res 
 * @param next 
 */
export async function verify(req: express.Request, res: express.Response, next: Function) {
    const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(403).json({
                success:false,
                statusCode: 403,
                message: 'verify: 403'
            })
        }
        try{
            await verifyUser(token);
            return next();
        }catch (err) {
            res.status(403).json({
                success: false,
                statusCode: 403,
                message: 'verify:403'
        })
    }
};

async function verifyUser(token: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        await jwt.verify(token, jwtToken.secret, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            return resolve(decoded); // JWT의 payload가 decoded에 저장됨.
        });
    });
}