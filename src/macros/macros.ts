import { App, Context } from '@slack/bolt';
import { MongoClient } from 'mongodb';
import * as edit_macro_button from './edit_macro_button';
import * as edit_macro_modal from './edit_macro_modal';

export async function getMacro (store: Promise<MongoClient>, context: Context, user: string, name: string): Promise<string> {
    name = name.toLowerCase();

    const coll = (await store).db().collection('macros');
    return (await coll.findOne(
        { _id: user },
        { projection: { _id: 0 } }
    ) as { [name: string]: string } ?? {})[name] ??
    (await coll.findOne(
        { _id: <string> context.botUserId },
        { projection: { _id: 0 } }
    ) as { [name: string]: string } ?? {})[name] ??
    name;
}

export const register = ({ app, store }: { app: App; store: Promise<MongoClient> }): void => {
    [ edit_macro_button, edit_macro_modal ].forEach(it => {
        it.register({ app, store });
    });
};
