// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, ConversationReference, TurnContext } from 'botbuilder';

export class MyBot extends ActivityHandler {
  private conversationReferences: ConversationReference;

    constructor(conversationReferences) {
      super();
      this.conversationReferences = conversationReferences;

      this.onConversationUpdate(async (context, next) => {
        this.addConversationReference(context.activity);

        await next();
      });

      this.onMembersAdded(async (context, next) => {
          const membersAdded = context.activity.membersAdded;
          for (const member of membersAdded) {
              if (member.id !== context.activity.recipient.id) {
                  await context.sendActivity('Hello and welcome!');
              }
          }
          // By calling next() you ensure that the next BotHandler is run.
          await next();
      });
    }

  private addConversationReference(activity) {
    const conversationReference = TurnContext.getConversationReference(activity);
    this.conversationReferences[conversationReference.conversation.id] = conversationReference;
  }
}
