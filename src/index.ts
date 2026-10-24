import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import { loadCommands } from "@/lib/loadCommands.js";

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("DISCORD_TOKEN not filled in .env");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = await loadCommands();

client.once(Events.ClientReady, (c) => {
  console.log(`Online as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    const msg = {
      content: "Failed executing command.",
      flags: MessageFlags.Ephemeral,
    } as const;
    if (interaction.replied || interaction.deferred)
      await interaction.followUp(msg);
    else await interaction.reply(msg);
  }
});

await client.login(token);
