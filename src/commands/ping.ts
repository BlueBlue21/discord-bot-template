import { SlashCommandBuilder, CommandInteraction, Client, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    run: async (interaction: CommandInteraction, client: Client) => {
        const embed = new EmbedBuilder()
            .setTitle("Ping!")
            .setDescription(`Pong! **(${client.ws.ping}ms!)**`)
            .setTimestamp()
            .setColor("Green");

        await interaction.reply({ embeds: [embed] });
    }
};
