import fs from "fs/promises";
import path from "path";
import { REST } from "@discordjs/rest"
import { Routes } from "discord.js";

import { token } from "../config.json";

const clientId: string = Buffer.from(token.split(".")[0], "base64").toString("utf8");

const commands: Array<object> = [];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    const commandFiles = await fs.readdir(path.join(__dirname, "../commands"));

    await Promise.all(commandFiles.map(async (file) => {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
            const command = await import(`../commands/${file}`);

            commands.push(command.default?.data.toJSON());
        }
    }));

    try {
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
    } catch (error) {
        throw error;
    }
})();
