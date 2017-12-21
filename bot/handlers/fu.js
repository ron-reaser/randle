const CONFIG = require('../config');
var randomInt = require('../functions/random-int');

// TODO: refactor into a 'macro plugin' for roll.js
module.exports = function(controller, handler) {

    const MAX_DICE = 20;

    const ANSWERS = {
        1: {'phrase': '*no*, *and*...',  'color': '#E8E8E8'},
        2: {'phrase': '*no*.',           'color': '#C2D9E6'},
        3: {'phrase': '*no*, *but*...',  'color': '#9DCAE4'},
        4: {'phrase': '*yes*, *but*...', 'color': '#77BBE3'},
        5: {'phrase': '*yes*.',          'color': '#52ACE1'},
        6: {'phrase': '*yes*, *and*...', 'color': '#2C9EE0'},
    };

    controller.hears(/^!fu\b(.*)/i, CONFIG.HEAR_ANYWHERE, function(bot, message) {
        try {
            var modifier = 0;
            var found = message.match[1].trim().match(/[+-][0-9]*/ig);
            if (found) found.forEach(function(element) {
                modifier += (parseInt(element) || (element === 0 ? 0 : parseInt(element + "1")));
            });
            var dice = 1 + Math.abs(modifier);
            if (dice > MAX_DICE)
                throw new Error(`Total number of dice must be ${MAX_DICE} or less.`);

            var attach = [];
            var rolls = [];
            for (let i = 1; i <= dice; i++) {
                let roll = randomInt(1, 6);
                rolls.push(roll);

                let phrase = ANSWERS[roll].phrase;
                let color = ANSWERS[roll].color;
                if (attach.length < CONFIG.MAX_ATTACH)
                    attach.push({
                        'text': `${roll} → ${phrase}`,
                        'mrkdwn_in': ['text'],
                        'color': color
                    });
                else throw new Error(`Exceeded the ${CONFIG.MAX_ATTACH} roll limit.`);
            }
            rolls.sort();

            if (dice == 1) {
                let roll = rolls[0];
                let phrase = ANSWERS[roll].phrase;
                bot.replyWithTyping(message, {
                    'response_type': 'in_channel',
                    'text': `<@${message.user}>, the answer is ${phrase}`,
                    'attachments': attach
                });
            }
            else {
                let roll, type, quality;
                if (modifier > 0) {
                    roll = rolls.pop();
                    type = 'bonus';
                    quality = 'best';
                }
                else {
                    roll = rolls.shift();
                    type = 'penalty';
                    quality = 'worst';
                }

                let extra = dice - 1;
                let cube = extra > 1 ? 'dice' : 'die';
                let phrase = ANSWERS[roll].phrase;
                bot.replyWithTyping(message, {
                    'response_type': 'in_channel',
                    'text': `<@${message.user}>, with ${extra} ${type} ${cube}, the *${quality}* answer is ${phrase}`,
                    'attachments': attach
                });
            }
        }
        catch(err) {
            handler.error(bot, message, err);
        }
    });

};
