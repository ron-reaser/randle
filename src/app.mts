import { ActivityType, Client, Collection, Events, GatewayIntentBits, PresenceUpdateStatus, type ClientCommand, type ClientEvent, type ClientRoute } from 'discord.js';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendBlame } from './lib/messages.mts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
Intents:
    Guilds [CHANNEL_UPDATE]
Scopes:
    applications.commands
    bot
Bot Permissions:
    Send Messages
    Send Messages in Threads
    Use Slash Commands
    View Audit Log [channelUpdate event]
*/

try {
    if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'development')
        throw 'Environment must be production or development only.';
    const environment = process.env.NODE_ENV;

    const client = new Client({ intents: [
        GatewayIntentBits.Guilds
    ] });

    const port = Number(process.env.PORT ?? 8080);
    const app = express();

    for (const folder of [ 'routes', 'events', 'commands' ]) {
        const folderPath = path.join(__dirname, folder);
        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.mts'));

        if (folder == 'commands')
            client.commands = new Collection();

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            if (folder == 'routes') {
                const route = await import(filePath) as ClientRoute;
                route.register(app, client);
                console.debug(`Express loaded ${route.name} route on port ${port}.`);
            }
            else if (folder == 'events') {
                const event = await import(filePath) as ClientEvent;
                client.on(event.name, (...args) => { event.trigger(...args); });
                console.debug(`Discord loaded ${event.name} event.`);
            }
            else if (folder == 'commands') {
                const command = await import(filePath) as ClientCommand;
                client.commands.set(command.data.name, command);
                console.debug(`Discord loaded ${command.data.name} command.`);
            }
        }
    }

    client.once(Events.ClientReady, async () => {
        if (environment == 'production') {
            console.debug('Discord ready in production.');
            client.user?.setPresence({
                status: PresenceUpdateStatus.Online,
                activities: [ { name: '🎲 Ready to Roll', type: ActivityType.Custom } ]
            });
        }
        else if (environment == 'development') {
            const commands = [ ...client.commands.values() ].map(it => it.data);
            await client.application?.commands.set(commands);
            console.debug(`Discord registered ${commands.length} commands.`);

            console.debug('Discord ready in development.');
            client.user?.setPresence({
                status: PresenceUpdateStatus.DoNotDisturb,
                activities: [ { name: '🏗️ Maintenance', type: ActivityType.Custom } ]
            });
        }

        app.listen(port);
    });

    await client.login(process.env.DISCORD_TOKEN);
}
catch (error: unknown) {
    await sendBlame(error);
}
