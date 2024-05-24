require("dotenv").config()
const chrono = require('chrono-node');
const { App } = require('@slack/bolt');
const { humanReadableDiff } = require('./utils');

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

(async () => {

    app.action('convert_posted_date', async ({ body, ack, respond,  }) => {
        await ack();

        const user = (await app.client.users.info({
            user: body.user.id
        })).user
        const tz = user?.tz

        const date = new Date(body.actions[0].value)

        await app.client.chat.postEphemeral({
            user: body.user.id,
            channel: body.channel.id,
            thread_ts: body.message_ts,
            text: `This will happen on ${date.toLocaleString('en-US', { timeZone: tz, timeStyle: "short", dateStyle: "long" })} (${user.tz_label}) *or* ${humanReadableDiff(date, new Date())}`
        })
    });
    app.command('/timepost', async ({ ack, command, respond, say, body }) => {
        await ack()
        const user = (await app.client.users.info({
            user: body.user_id
        })).user
        const tz = user?.tz

        const date = chrono.parseDate(command.text, {
            timezone: tz,
        })
        await say({
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `This will happen on ${date.toLocaleString('en-US', { timeZone: 'Etc/Utc', timeStyle: "short", dateStyle: "long" })} (UTC)\nOriginal time (${user.tz_label}): ${date.toLocaleString('en-US', { timeZone: tz, timeStyle: "short", dateStyle: "long" })}`
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Convert this time into your timezone"
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Convert",
                            "emoji": true
                        },
                        "value": date.toISOString(),
                        "action_id": "convert_posted_date"
                    }
                }
            ]
        })
    })

    await app.start();
})();

process.on("unhandledRejection", (error) => {
    console.error(error);
});