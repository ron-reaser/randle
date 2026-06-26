import { ApplicationCommandOptionType, ApplicationCommandType, type ChatInputApplicationCommandData, ChatInputCommandInteraction, Colors, ComponentType, MessageFlags } from 'discord.js';
import { MAX_EMBED_DESCRIPTION } from '../lib/constants.mts';
import { shuffleInPlace } from '../lib/lists.mts';
import { commas, itemize, trunc, wss } from '../lib/texts.mts';

export const data: ChatInputApplicationCommandData = {
    type: ApplicationCommandType.ChatInput,
    name: 'shuffle',
    description: 'Shuffle items',
    options: [
        {
            name: 'items',
            type: ApplicationCommandOptionType.String,
            description: 'A list of items or a range size',
            required: true
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
        spoiler = (interaction.options.get('spoiler')?.value ?? false) as boolean,
        items = shuffleInPlace(elements);

    await interaction.reply({
        flags: MessageFlags.IsComponentsV2,
        components: [
            {
                type: ComponentType.TextDisplay,
                content: `${interaction.user.toString()} shuffled **${elements.length}** item${elements.length != 1 ? 's' : ''}`,
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

    // await interaction.reply({
    //     flags: MessageFlags.IsComponentsV2,
    //     components: [
    //         {
    //             type: ComponentType.TextDisplay,
    //             content: `${interaction.user.toString()} shuffled ${items.length != 1 ? 'items' : 'an item'}`,
    //         },
    //         {
    //             type: ComponentType.Container,
    //             accent_color: Colors.Greyple,
    //             spoiler: true,
    //             components: [
    //                 {
    //                     type: ComponentType.TextDisplay,
    //                     content: `**${items.length} Item${items.length != 1 ? 's' : ''}**`
    //                 },
    //                 {
    //                     type: ComponentType.TextDisplay,
    //                     content: trunc(commas(items.map(item => `**${wss(item)}**`)), MAX_EMBED_DESCRIPTION)
    //                 }
    //             ]
    //         }
    //     ]
    // });
}
