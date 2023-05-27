import { Command } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';

import { formatI18n } from '@/utils/i18n';

export class PingCommand extends Command {
  override registerApplicationCommands(registry: Command.Registry): void {
    registry.registerChatInputCommand(builder => (
      builder
        .setName(this.name)
        .setDescription(formatI18n('en-US', 'commands/ping:description'))
        .setDescriptionLocalizations({
          'ja': formatI18n('ja', 'commands/ping:description')
        })
    ), {
      idHints: ['1106873574653964358']
    });
  }

  override async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    await interaction.editReply(await resolveKey(interaction, 'commands/ping:pong', {
      latency: interaction.client.ws.ping
    }));
  }
}
