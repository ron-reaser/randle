import { Events, type Interaction } from 'discord.js';
import { sendBlame } from '../lib/messages.mts';

export const name = Events.InteractionCreate;

export async function trigger (interaction: Interaction): Promise<void> {
    try {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (command) {
                await command.execute(interaction);
            }
            else {
                throw `Unrecognized command name ${interaction.commandName}.`;
            }
        }
        else {
            throw 'Unsupported interaction type.';
        }
    }
    catch (error: unknown) {
        await sendBlame(error, interaction);
    }
}
