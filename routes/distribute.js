module.exports = (app, receiver) => {

    receiver.app.get('/install', async (req, res, next) => {
        let result = await app.client.oauth.v2.access({
            client_id: process.env.SLACK_CLIENT_ID,
            client_secret: process.env.SLACK_CLIENT_SECRET,
            code: req.query.code,
            state: req.query.state
        });
        
        if (result) {
            // TODO do something with state
            res.sendStatus(200);
        }
        else {
            res.sendStatus(400);
        }
  });

}
