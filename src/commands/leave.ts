import { SlashCommandBuilder } from "discord.js";
import type { Command } from "@/types.js";
import { getVoiceConnection } from "@discordjs/voice";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the voice channel I'm currently on"),

  async execute(interaction) {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const connection = getVoiceConnection(guildId);
    if (!connection) {
      await interaction.reply("I'm not connected to any voice channel");
      return;
    }

    connection.destroy();
    await interaction.reply("Done!");
  },
};

export default command;
