var fyShuffle = require('../functions/fisher-yates');

module.exports = function(controller, handler) {

    controller.hears( /^!shuffle\b(.*)/i, ['direct_message', 'direct_mention', 'mention', 'ambient'], function(bot, message) {
        try {
            bot.startTyping(message);
            let shuffled = shuffleHelper(message.match[1]).join('*, *');
            bot.reply(message, {
                'text': `<@${message.user}>, you shuffled *${shuffled}*.`
            });
        }
        catch(err) {
            handler.error(bot, message, err);
        }
    });

    controller.hears( /^!draw\b(.*)/i, ['direct_message', 'direct_mention', 'mention', 'ambient'], function(bot, message) {
        try {
            bot.startTyping(message);
            let element = shuffleHelper(message.match[1]).shift();
            bot.reply(message, {
                'text': `<@${message.user}>, you drew *${element}*.`
            });
        }
        catch(err) {
            handler.error(bot, message, err);
        }
    });

    function shuffleHelper(expression) {
        var elements = expression.trim().split(/\s*,\s*/);

        if (elements.length < 2)
            throw new Error('You must provide a comma-separated list of at least two elements.');

        fyShuffle(elements);

        return elements;
    }

};