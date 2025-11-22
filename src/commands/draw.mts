import { ApplicationCommandOptionType, ApplicationCommandType, type ChatInputApplicationCommandData, ChatInputCommandInteraction } from 'discord.js';
import { MAX_EMBED_DESCRIPTION } from '../library/constants.mts';
import { choose } from '../library/lists.mts';
import { commas, itemize, trunc, wss } from '../library/texts.mts';

export const data: ChatInputApplicationCommandData = {
    type: ApplicationCommandType.ChatInput,
    name: 'draw',
    description: 'Draw some shuffled items',
    options: [
        {
            name: 'items',
            type: ApplicationCommandOptionType.String,
            description: 'A list of items, a range size, or an @everyone, @here, or @role mention',
            required: true
        },
        {
            name: 'quantity',
            type: ApplicationCommandOptionType.Integer,
            description: 'Number of items to draw (or 1 by default)',
            required: false
        }
    ]
};

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
    const elements = interaction.options.get('items')?.value as string,
        quantity = (interaction.options.get('quantity')?.value ?? 1) as number;

    let items = itemize(elements);

    if (items.length < 1)
        throw 'At least 1 item is required.';

    if (items.length < quantity)
        throw 'Quantity must not exceed the number of items.';

    items = choose(items, quantity);

    await interaction.reply({
        content: `${interaction.user.toString()} drew ${items.length != 1 ? 'items' : 'an item'}`,
        embeds: [ {
            title: `${items.length} Item${items.length != 1 ? 's' : ''}`,
            description: trunc(commas(items.map(item => `**${wss(item)}**`)), MAX_EMBED_DESCRIPTION)
        } ]
    });
}
