import fs from "fs/promises";
import path from "path";
import { Client, Collection, GatewayIntentBits, EmbedBuilder, ApplicationCommandDataResolvable } from "discord.js";

import { commandType } from './types/Interactions'
import registerSlash from "./modules/registerSlash";

export class BetterClient extends Client {
    private commands = new Collection<string, commandType>()

    constructor() {
        super({
            intents: GatewayIntentBits.Guilds
        });
    }

    start(token: string) {
        this.registerCommands().then(() => { // Re-registers the commands everytime this script is ran
            console.log("Logging into Discord....");
            this.login(token).catch((e) => {
                console.log("Failed to log into Discord.");
                throw e;
            });
        })
    }

    private async registerCommands() {

        registerSlash();

        const commandFiles = await fs.readdir(path.join(__dirname, "/commands"));

        await Promise.all(commandFiles.map(async (file) => {
            if (file.endsWith(".ts") || file.endsWith(".js")) {
                const command: commandType = await import(`./commands/${file}`);

                this.commands.set(command.data.name, command);
            }
        }));
    }

    public async listen() {
        this.on("interactionCreate", async interaction => {
            if (!interaction.isChatInputCommand()) return;

            const command = this.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.run(interaction, this);
            } catch (error) {
                const embed = new EmbedBuilder()
                    .setTitle("Error!")
                    .setDescription(`${String(error) || "Unexpected error occured!"}`)
                    .setTimestamp()
                    .setColor("Red");

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        });
    }
}
