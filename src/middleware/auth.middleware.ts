import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import { userService } from "../service/user.service";

/**
 * middleWare: header에서 token 을 받아 검증
 * @param req 
 * @param res 
 * @param next 
 */
export async function verifyUser(req: express.Request, res: express.Response, next: Function) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({
            success: false,
            statusCode: 403,
            message: 'verify: 403'
        })
    }
    try {
        const userData = await verify(req, token);
        const result = await userService.getUser(userData.tokenId);

        if (result.getDataValue("role") === 'User') {
            return next();
        } else {
            res.status(403).json({
                success: false,
                statusCode: 403,
                message: 'verify: 403 권한이 없습니다.'
            })
        }
    } catch (err) {
        res.status(403).json({
            success: false,
            statusCode: 403,
            message: 'verify: 403'
        });
    }
};

export async function verifyHospital(req: express.Request, res: express.Response, next: Function) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({
            success: false,
            statusCode: 403,
            message: 'verify: 403'
        })
    }
    try {
        const userData = await verify(req, token);
        const result = await userService.getUser(userData.tokenId);

        if (result.getDataValue("role") === 'Hospital') {
            return next();
        } else {
            res.status(403).json({
                success: false,
                statusCode: 403,
                message: 'verify: 403 권한이 없습니다.'
            })
        }
    } catch (err) {
        res.status(403).json({
            success: false,
            statusCode: 403,
            message: 'verify: 403'
        });
    }
};


async function verify(req, token: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        await jwt.verify(token, req.app.locals.secret, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            return resolve(decoded); // JWT의 payload가 decoded에 저장됨.
        });
    });
}