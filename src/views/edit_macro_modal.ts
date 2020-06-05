import { View, InputBlock } from '@slack/web-api';

export default async (name: string, replacement: string): Promise<View> => ({
    type: 'modal',
    callback_id: 'edit_macro_modal',
    ...(name ? {private_metadata: name} : {}),
    title: {
        type: 'plain_text',
        text: name ? `Edit macro ${name}` : 'Create new macro'
    },
    submit: {
        type: 'plain_text',
        text: name ? 'Update' : 'Create'
    },
    close: {
        type: 'plain_text',
        text: 'Cancel'
    },
    blocks: [
        ...(!name ? [<InputBlock>{
            type: 'input',
            block_id: 'name',
            label: {
                type: 'plain_text',
                text: 'Macro Name'
            },
            hint: {
                type: 'plain_text',
                text: "Macro names are case insensitive. If the name is already in use, the existing macro's replacement will be updated instead."
            },
            element: {
                type: 'plain_text_input',
                action_id: 'input',
                min_length: 3,
                max_length: 15,
                placeholder: {
                    type: 'plain_text',
                    text: 'Name'
                }
            }
        }] : []),
        <InputBlock>{
            type: 'input',
            block_id: 'replacement',
            label: {
                type: 'plain_text',
                text: 'Replacement Text'
            },
            element: {
                type: 'plain_text_input',
                action_id: 'input',
                min_length: 3,
                ...(replacement ? {initial_value: replacement} : {}),
                placeholder: {
                    type: 'plain_text',
                    text: 'Text'
                }
            }
        },
        ...(name ? [<InputBlock>{
            type: 'input',
            optional: true,
            block_id: 'options',
            label: {
                type: 'plain_text',
                text: 'Settings'
            },
            element: {
                type: 'checkboxes',
                action_id: 'inputs',
                options: [
                    {
                        text: {
                            type: 'plain_text',
                            text: 'Delete this macro.'
                        },
                        description: {
                            type: 'plain_text',
                            text: "This action can't be undone."
                        },
                        value: 'delete'
                    }
                ]
            }
        }] : [])
    ]
});