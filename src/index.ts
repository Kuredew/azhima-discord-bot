import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
} from "discord.js";
import { loadCommands } from "@/lib/loadCommands.js";
import express from "express";

const PORT = process.env.PORT || 8080;
const app = express();

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("DISCORD_TOKEN not filled in .env");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = await loadCommands();

client.once(Events.ClientReady, (c) => {
  console.log(`Online as ${c.user.tag}`);

  client.user?.setPresence({
    activities: [
      {
        name: "After Effects",
        type: ActivityType.Playing,
      },
    ],
  });
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

app.get("/health", (_, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

const startApp = async () => {
  try {
    app.listen(PORT, () => {
      console.log("Express running on port " + PORT);
    });
    console.log("Connecting to Discord...");

    await client.login(token);
  } catch (error) {
    console.error("Failed starting application: ", error);
    process.exit(1);
  }
};

console.log("Starting app...");
startApp();
