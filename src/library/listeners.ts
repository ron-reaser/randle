import { BotMessageEvent, Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';

const CHANNEL = 'channel',
    PRIVATE_CHANNEL = 'group',
    DIRECT = 'im',
    MULTI_DIRECT = 'mpim';

export const debug: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({ message, context, next }) => {
    console.debug({
        message: message,
        context: context
    });
    await next?.();
};

export const nonthread: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({ message, next }) => {
    if (!(<BotMessageEvent> message).thread_ts)
        await next?.();
};

export const direct: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({ message, next }) => {
    const where = [DIRECT];
    if (where.includes((<BotMessageEvent> message).channel_type))
        await next?.();
};

export const community: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({ message, next }) => {
    const where = [ CHANNEL, PRIVATE_CHANNEL, MULTI_DIRECT ];
    if (where.includes((<BotMessageEvent> message).channel_type))
        await next?.();
};

export const anywhere: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({ message, next }) => {
    const where = [ CHANNEL, PRIVATE_CHANNEL, MULTI_DIRECT, DIRECT ];
    if (where.includes((<BotMessageEvent> message).channel_type))
        await next?.();
};
