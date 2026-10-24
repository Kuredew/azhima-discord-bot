import { GuildMember, SlashCommandBuilder } from "discord.js";
import type { Command } from "@/types.js";
import { joinVoiceChannel } from "node_modules/@discordjs/voice/dist/index.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join a voice channel"),

  async execute(interaction) {
    const guildMember = interaction.member as GuildMember;
    const voiceChannel = guildMember.voice.channel;

    if (!voiceChannel) {
      await interaction.reply("Join a voice channel first!");
      return;
    }

    try {
      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      await interaction.reply("Joined a voice channel!");
    } catch (error) {
      console.error(error);
      await interaction.reply("Cannot join a voice channel");
    }
  },
};

export default command;
