import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { config as configDotenv } from 'dotenv';

import { env } from '@/utils/env';
import { fetchLanguage } from '@/utils/i18n';

import '@sapphire/plugin-i18next/register';

configDotenv();

const DISCORD_BOT_TOKEN = env('DISCORD_BOT_TOKEN');

const client = new SapphireClient({
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
  i18n: { fetchLanguage }
});

client.login(DISCORD_BOT_TOKEN);
