import fs from "fs";
import { Client, Collection, CommandInteraction, GatewayIntentBits, EmbedBuilder, ApplicationCommandDataResolvable } from "discord.js";

import "./modules/registerSlash";

export class BetterClient extends Client {
    commands: Collection<string, any> = new Collection();

    constructor() {
        super({
            intents: GatewayIntentBits.Guilds
        });
    }

    start(token: string) {
        this.registerCommands();
        this.login(token);
    }

    registerCommands() {
        const commands: ApplicationCommandDataResolvable[] = [];

        const commandFiles = fs.readdirSync(__dirname + "/commands").filter(file => file.endsWith(".js"));

        commandFiles.forEach(file => {
            const command = require(`./commands/${file}`);

            this.commands.set(command.data?.name, command);

            commands.push(command);
        });

        this.on("interactionCreate", async interaction => {
            if (!interaction.isChatInputCommand()) return;

            interface commandType {
                execute: (interaction: CommandInteraction, client: Client) => Promise<void>;
            }

            const command: commandType = this.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction, this);
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
