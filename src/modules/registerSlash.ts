import fs from "fs";
import path from "path";
import { REST } from "@discordjs/rest"
import { Routes } from "discord.js";

import { token } from "../config.json";

const clientId: string = Buffer.from(token.split(".")[0], "base64").toString("utf8");

const commands: Array<object> = [];

const commandFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter(file => file.endsWith(".js"));

commandFiles.forEach(file => {
    commands.push(require(`../commands/${file}`).data.toJSON());
});

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        await rest.put(Routes.applicationCommands(clientId), { body: [] });
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
    } catch (error) {
        throw error;
    }
})();
