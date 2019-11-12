const CONFIG = require('./config');

if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

const { Botkit } = require('botkit'),
      { MongoDbStorage } = require('botbuilder-storage-mongodb'),
      { SlackAdapter, SlackEventMiddleware, SlackMessageTypeMiddleware  } = require('botbuilder-adapter-slack');

let adapter = new SlackAdapter({
    botToken: process.env.SLACK_BOT_TOKEN,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    clientSigningSecret: process.env.SLACK_SIGNING_SECRET,
    scopes: ['bot']
});

let controller = new Botkit({
    webhook_uri: '/api/messages',
    adapter: adapter,
    storage: new MongoDbStorage({
        url: process.env.MONGODB_URI,
        database: CONFIG.DATABASE,
        collection: CONFIG.COLLECTIONS.CONVERSATION
    })
});

adapter.use(new SlackEventMiddleware());
adapter.use(new SlackMessageTypeMiddleware());

controller.usePlugin(require('./plugins/handler'));
controller.usePlugin(require('./plugins/macros'));
// TODO add Help system to explain command syntax

controller.ready(() => {
    controller.webserver.get('/status', async(req, res) => {
         res.send('UP')
    });

    controller.webserver.get(['/', '/logo', '/face'], async(req, res) => {
         res.sendFile(__dirname + '/static/img/logo.png');
    });

    controller.loadModules(__dirname + '/features');
});