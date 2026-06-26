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
            description: 'A list of items or a range size',
            required: true
        },
        {
            name: 'quantity',
            type: ApplicationCommandOptionType.Integer,
            description: 'Number of items to draw (or 1 by default)',
            required: false
        },
        {
            name: 'spoiler',
            type: ApplicationCommandOptionType.Boolean,
            description: 'Whether to spoiler the results (or false by default)',
            required: false
        }
    ]
};

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
    const elements = itemize(interaction.options.get('items')?.value as string),
        quantity = (interaction.options.get('quantity')?.value ?? 1) as number,
        spoiler = (interaction.options.get('spoiler')?.value ?? false) as boolean;

    if (elements.length < 1)
        throw 'At least 1 item is required.';
    if (quantity > elements.length)
        throw 'Quantity must not exceed the number of items.';

    const items = choose(elements, quantity);

    await interaction.reply({
        flags: MessageFlags.IsComponentsV2,
        components: [
            {
                type: ComponentType.TextDisplay,
                content: `${interaction.user.toString()} drew **${items.length}** of **${elements.length}** item${elements.length != 1 ? 's' : ''}`,
            },
            {
                type: ComponentType.Container,
                accent_color: Colors.Greyple,
                spoiler: spoiler,
                components: [
                    {
                        type: ComponentType.TextDisplay,
                        content: trunc(commas(items.map(item => `**${wss(item)}**`)), MAX_EMBED_DESCRIPTION),
                    }
                ]
            }
        ]
    });
}
