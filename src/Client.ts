import fs from "fs/promises";
import path from "path";
import { Client, Collection, CommandInteraction, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ApplicationCommandDataResolvable } from "discord.js";

import "./modules/registerSlash";

interface commandType {
    default: {
        data: SlashCommandBuilder;
        run: (interaction: CommandInteraction, client: Client) => Promise<void>;
    }
}

export class BetterClient extends Client {
    commands = new Collection<string, commandType>()

    constructor() {
        super({
            intents: GatewayIntentBits.Guilds
        });
    }

    start(token: string) {
        this.registerCommands();
        this.login(token);
    }

    async registerCommands() {
        const commands: ApplicationCommandDataResolvable[] = [];

        const commandFiles = await fs.readdir(path.join(__dirname, "/commands"));

        await Promise.all(commandFiles.map(async (file) => {
            if (file.endsWith(".ts") || file.endsWith(".js")) {
                const command = await import(`./commands/${file}`);

                this.commands.set(command.default?.data.name, command);
                commands.push(command);
            }
        }));

        this.on("interactionCreate", async interaction => {
            if (!interaction.isChatInputCommand()) return;

            const command = this.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.default.run(interaction, this);
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
