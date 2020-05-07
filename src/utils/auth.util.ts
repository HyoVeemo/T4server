import * as jwt from 'jsonwebtoken';

export function auth(req) {
    const token = req.get('x-access-token');
    const secret = req.app.locals.secret;
    let decoded = jwt.verify(token, secret);

    return decoded;
}