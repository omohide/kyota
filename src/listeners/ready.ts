
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events } from 'discord.js';

import type { ListenerOptions } from '@sapphire/framework';
import type { Client } from 'discord.js';

@ApplyOptions<ListenerOptions>({
  event: Events.ClientReady,
  once: true
})
export class ReadyListener extends Listener {
  run({ user }: Client): void {
    if (!user) {
      this.container.logger.error('Client is empty');

      return;
    }

    this.container.logger.info(`Successfully logged in as ${user.username} (${user.id})`);
  }
}
