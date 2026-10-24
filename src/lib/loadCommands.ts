import { readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Command } from "@/types.js";

export async function loadCommands(): Promise<Map<string, Command>> {
  const dir = join(import.meta.dirname, "..", "commands");
  const commands = new Map<string, Command>();

  for (const file of readdirSync(dir).filter(
    (f) => f.endsWith(".ts") || f.endsWith(".js"),
  )) {
    const mod = await import(pathToFileURL(join(dir, file)).href);
    const command: Command = mod.default;
    commands.set(command.data.name, command);
  }
  return commands;
}
