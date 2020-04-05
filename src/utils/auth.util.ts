import * as jwt from 'jsonwebtoken';

export function auth(req: any) {
    const token = req.get('x-access-token');
    const secret = req.app.locals.secret;
    let auth = jwt.verify(token, secret); // decoded

    return auth;
}