"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const botbuilder_1 = require("botbuilder");
// This bot's main dialog.
const bot_1 = require("./bot");
const ENV_FILE = path.join(__dirname, '..', '.env');
dotenv_1.config({ path: ENV_FILE });
// Create HTTP server.
const app = express();
app.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.log(`\nSee https://aka.ms/connect-to-bot for more information`);
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new botbuilder_1.BotFrameworkAdapter({
    appId: process.env.MicrosoftAppID,
    appPassword: process.env.MicrosoftAppPassword,
});
// Catch-all for errors.
adapter.onTurnError = (context, error) => __awaiter(this, void 0, void 0, function* () {
    // This check writes out errors to console log .vs. app insights.
    console.error(`\n [onTurnError]: ${error}`);
    // Send a message to the user
    yield context.sendActivity(`Oops. Something went wrong!`);
});
// Create the main dialog.
const conversationReferences = {};
const myBot = new bot_1.MyBot(conversationReferences);
// Listen for incoming requests.
app.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        // Route to main dialog.
        yield myBot.run(context);
    }));
});
app.post('/api/newbuild', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const message = req.body.message;
    console.log(conversationReferences);
    for (const conversationReference of Object.values(conversationReferences)) {
        yield adapter.continueConversation(conversationReference, (turnContext) => __awaiter(this, void 0, void 0, function* () {
            yield turnContext.sendActivity(message);
        }));
    }
    res.json({ message: 'Sent' });
}));
//# sourceMappingURL=index.js.map