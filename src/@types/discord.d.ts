import 'discord.js';
import type { Collection } from 'discord.js';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, ClientCommand>;
    }

    export interface ClientRoute {
        name: keyof ClientEvents;
        register: (app: Express, client?: Client) => void;
    }

    export interface ClientEvent {
        name: keyof ClientEvents;
        trigger: (...args: unknown[]) => Promise<void>;
    }

    export interface ClientCommand {
        data: ApplicationCommandData;
        execute: (interaction: CommandInteraction) => Promise<void>;
    }
}
