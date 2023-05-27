import { Command } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { DiscordjsError, DiscordjsErrorCodes, GuildMember, GuildMemberRoleManager, PermissionFlagsBits } from 'discord.js';

import { hasAnyKeys } from '@/utils/hasAnyKeys';
import { formatI18n } from '@/utils/i18n';

export class WhitelistCommand extends Command {
  readonly ['constructor'] = WhitelistCommand;

  // TODO: hard-coding
  static readonly #WHITELIST_MANAGE_ROLES: readonly string[] = ['1042345934249545779'];

  // TODO: hard-coding
  static readonly #WHITELIST_MEMBER_ROLE = '1040823093414866984' as const satisfies string;

  override registerApplicationCommands(registry: Command.Registry): void {
    registry.registerChatInputCommand(builder => (
      builder
        .setName(this.name)
        .setDescription(formatI18n('en-US', 'commands/whitelist:description'))
        .setDescriptionLocalizations({
          'ja': formatI18n('ja', 'commands/whitelist:description')
        })
        .addSubcommand(options => (
          options
            .setName('add')
            .setDescription(formatI18n('en-US', 'commands/whitelist:add_subcommand_description'))
            .setDescriptionLocalizations({
              'ja': formatI18n('ja', 'commands/whitelist:add_subcommand_description')
            })
            .addUserOption(options => (
              options
                .setName('member')
                .setDescription(formatI18n('en-US', 'commands/whitelist:add_subcommand_member_options_description'))
                .setDescriptionLocalizations({
                  'ja': formatI18n('ja', 'commands/whitelist:add_subcommand_member_options_description')
                })
            ))
        ))
        .addSubcommand(options => (
          options
            .setName('remove')
            .setDescription(formatI18n('en-US', 'commands/whitelist:remove_subcommand_description'))
            .setDescriptionLocalizations({
              'ja': formatI18n('ja', 'commands/whitelist:remove_subcommand_description')
            })
            .addUserOption(options => (
              options
                .setName('member')
                .setDescription(formatI18n('en-US', 'commands/whitelist:remove_subcommand_member_options_description'))
                .setDescriptionLocalizations({
                  'ja': formatI18n('ja', 'commands/whitelist:remove_subcommand_member_options_description')
                })
            ))
        ))
    ), {
      idHints: ['1106924458909900930']
    });
  }

  // TODO: Add blacklist feature
  override async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
    try {
      const subCommand = interaction.options.getSubcommand();
      const { roles } = interaction.member ?? {};

      if (!(roles instanceof GuildMemberRoleManager)) {
        await interaction.reply(await resolveKey(interaction, 'common/command:cant_get_roles'));

        return;
      }


      if (!interaction.inGuild()) {
        await interaction.reply(await resolveKey(interaction, 'common/command:in_guild'));

        return;
      }

      const member = interaction.options.getMember('member');

      if (!(member instanceof GuildMember) || !(interaction.member instanceof GuildMember)) {
        await interaction.reply(await resolveKey(interaction, 'common/command:cant_get_member'));

        return;
      }

      if (member.id === interaction.member.id) {
        await interaction.reply(await resolveKey(interaction, 'common/command:cannot_yourself'));

        return;
      }

      const { me } = interaction.guild?.members ?? {};

      if (!me) {
        await interaction.reply(await resolveKey(interaction, 'common/command:unable_bot_permissions'));

        return;
      }

      if (!me.permissions.has(PermissionFlagsBits.ManageRoles)) {
        await interaction.reply(await resolveKey(interaction, 'common/command:necessary_permissions'));

        return;
      }

      const whitelistMemberRoleId = this.constructor.#WHITELIST_MEMBER_ROLE;

      switch (subCommand) {
        case 'add': {
          if (hasAnyKeys(member.roles, whitelistMemberRoleId)) {
            await interaction.reply(await resolveKey(interaction, 'commands/whitelist:member_already_whitelisted'));

            return;
          }

          await member.roles.add(whitelistMemberRoleId);
          await interaction.reply(await resolveKey(interaction, 'commands/whitelist:add_subcommand_success'));


          return;
        }

        case 'remove': {
          if (!hasAnyKeys(member.roles, whitelistMemberRoleId)) {
            await interaction.reply(await resolveKey(interaction, 'commands/whitelist:member_not_whitelisted'));

            return;
          }

          await member.roles.remove(whitelistMemberRoleId);
          await interaction.reply(await resolveKey(interaction, 'commands/whitelist:remove_subcommand_success'));

          return;
        }

        default: {
          await interaction.reply(await resolveKey(interaction, 'common/command:unknown_subcommand'));

          return;
        }
      }

    } catch (err) {
      if (err instanceof DiscordjsError) {
        switch (err.code) {
          case DiscordjsErrorCodes.CommandInteractionOptionNoSubcommand: {
            await interaction.reply(await resolveKey(interaction, 'common/command:subcommand_not_specified'));

            return;
          }
        }
      }

      this.container.logger.error(err);

      await interaction.reply(await resolveKey(interaction, 'common/command:unexpected_error'));
    }
  }
}
