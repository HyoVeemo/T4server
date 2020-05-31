import * as OneSignal from 'onesignal-node';
import User from '../models/User.model';

export default async (req, userIndex, msg) => {
    /* userIndex로 playerId 가져오기 */
    const user = await User.findOne({ where: { userIndex } });
    let include_player_ids: string[] = [user.getDataValue("playerId")];

    const client = new OneSignal.Client(req.app.locals.APP_ID, req.app.locals.API_KEY);
    const notification = {
        contents: {
            'en': msg
        },
        include_player_ids
    };

    try {
        const response = await client.createNotification(notification);
        console.log(response.body);
    } catch (e) {
        if (e instanceof OneSignal.HTTPError) {
            console.log(e.statusCode);
            console.log(e.body);
        }
    }
}