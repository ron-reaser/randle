const { edit_macro_modal } = require('../views/macros.js'),
      { home_view } = require('../views/home.js');

module.exports = (app, store) => {

    app.action('edit_macro_button', async ({ ack, body, action, context, client }) => {
        await ack();

        let user = body.user.id,
            name = action.value;

        let replacement;
        if (name) {
            name = name.toLowerCase();

            let coll = (await store).db().collection('macros');
            let macros = (await coll.findOne(
                { _id: user },
                { projection: { _id: 0} }
            ));

            if (macros[name])
                replacement = macros[name];
        }

        let modal = await edit_macro_modal({ name, replacement });

        await client.views.open({
            token: context.botToken,
            trigger_id: body.trigger_id,
            view: modal
        });
    });

    const re_macro = /^[\w_][\w\d_]{2,14}$/;
    app.view('edit_macro_modal', async ({ ack, body, context, view, client }) => {
        let user = body.user.id,
            name = view.private_metadata || view.state.values.name.input.value;

        if (!re_macro.test(name)) {
            return await ack({
                response_action: 'errors',
                errors: {
                    name: 'You can only use letters, digits, and underscores starting with a letter or underscore.'
                }
            });
        }
        name = name.toLowerCase();

        let replacement = view.state.values.replacement.input.value;

        let options_selected = [];
        if (view.state.values.options && view.state.values.options.inputs.selected_options)
            options_selected = view.state.values.options.inputs.selected_options.map(obj => obj.value);

        await ack();

        let coll = (await store).db().collection('macros');
        if (options_selected.includes('delete')) {
            let macros = (await coll.findOneAndUpdate(
                { _id: user },
                { $unset: { [name]: undefined } },
                { projection: { _id: 0} }
            )).value;

            if (Object.keys(macros).length == 1) {
                coll.deleteOne(
                    { _id: user }
                )
            }
        }
        else {
            (await coll.findOneAndUpdate(
                { _id: user },
                { $set: { [name]: replacement } },
                { projection: { _id: 0}, upsert: true }
            )).value;
        }

        let home = await home_view({ user, store });

        await client.views.publish({
            token: context.botToken,
            user_id: user,
            view: home
        });
    });

}
