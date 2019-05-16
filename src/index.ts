// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { config } from 'dotenv';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { BotFrameworkAdapter, TurnContext } from 'botbuilder';

// This bot's main dialog.
import { MyBot } from './bot';

const ENV_FILE = path.join(__dirname, '..', '.env');
config({ path: ENV_FILE });

// Create HTTP server.
const app = express();

app.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.log(`\nSee https://aka.ms/connect-to-bot for more information`);
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppID,
    appPassword: process.env.MicrosoftAppPassword,
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    console.error(`\n [onTurnError]: ${ error }`);
    // Send a message to the user
    await context.sendActivity(`Oops. Something went wrong!`);
};

// Create the main dialog.
const conversationReferences = {};
const myBot = new MyBot(conversationReferences);

// Listen for incoming requests.
app.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        await myBot.run(context);
    });
});

app.post('/api/newbuild', async (req, res) => {
  const message = req.body.message;
  console.log(conversationReferences);
  for (const conversationReference of Object.values(conversationReferences)) {
    await adapter.continueConversation(conversationReference, async (turnContext) => {
      await turnContext.sendActivity(message);
    });
  }
  res.json({ message: 'Sent' });
});
