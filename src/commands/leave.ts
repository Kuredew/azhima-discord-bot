import { SlashCommandBuilder } from "discord.js";
import type { Command } from "@/types.js";
import { getVoiceConnection } from "@discordjs/voice";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the voice channel I'm currently on"),

  async execute(interaction) {
    const guild = interaction.guild;
    if (!guild) return;

    const connection = getVoiceConnection(guild.id);
    const botChannel = guild.members.me?.voice.channel;

    if (!connection && !botChannel) {
      await interaction.reply("I'm not connected to any voice channel");
      return;
    }

    if (connection) {
      connection.destroy();
    } else {
      await guild.members.me?.voice.disconnect();
    }

    await interaction.reply("Done!");
  },
};

export default command;
