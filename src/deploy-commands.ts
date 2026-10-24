import { REST, Routes } from "discord.js";
import { loadCommands } from "@/lib/loadCommands.js";

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  throw new Error("DISCORD_TOKEN, CLIENT_ID, dan GUILD_ID harus diisi di .env");
}

const commands = await loadCommands();
const body = [...commands.values()].map((c) => c.data.toJSON());

const rest = new REST().setToken(DISCORD_TOKEN);
await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body });

console.log(`Berhasil mendaftarkan ${body.length} command.`);
