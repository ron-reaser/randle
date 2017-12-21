var Botkit = require('botkit'),
    MongoDB = require('botkit-storage-mongo');

if (!process.env.SLACK_BOT_TOKEN) {
    console.log('Missing environment variable: Slack bot token.');
    process.exit(1);
}

if (!process.env.MONGODB_URI) {
    console.log('Missing environment variable: MongoDB URI.');
    process.exit(1);
}

var controller = Botkit.slackbot({
    debug: false,
    require_delivery: true,
    storage: MongoDB({
        mongoUri: process.env.MONGODB_URI,
        tables: undefined
    })
});

controller.spawn({
    token: process.env.SLACK_BOT_TOKEN
}).startRTM(function(err) {
    if (err) throw new Error(err);
});

var handler = {
    error: function(bot, message, err) {
        bot.whisper(message, {
            'text': `<@${message.user}>, your command caused an error. Please report it to the developer.`,
            'attachments': [{
                'text': err.toString(),
                'color': 'danger'
            }]
        });
    }
};

require('./handlers/echo')(controller);
require('./handlers/roll')(controller, handler);
require('./handlers/fu')(controller, handler);
require('./handlers/deck')(controller, handler);
