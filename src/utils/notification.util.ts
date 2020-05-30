import * as OneSignal from 'onesignal-node';

export default async (req, userIndex, msg) => {
    /* userIndex로 playerId 가져오기 */


    const client = new OneSignal.Client(req.app.locals.APP_ID, req.app.locals.API_KEY);
    const notification = {
        contents: {
            'en': msg
        },
        include_player_ids: ['d0cceb43-ef07-4204-9fd9-451984652a53', 'a8a683b5-0ac2-4966-aac1-ee25b01f88d7', 'fb80547d-f962-4b82-a7c2-c93187939546', 'd1eec245-1330-4d39-9c52-f3564748533d']
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