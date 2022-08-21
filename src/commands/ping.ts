import { SlashCommandBuilder, CommandInteraction, Client, EmbedBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    async execute(interaction: CommandInteraction, client: Client) {
        const embed = new EmbedBuilder()
            .setTitle("Ping!")
            .setDescription(`Pong! **(${client.ws.ping}ms!)**`)
            .setTimestamp()
            .setColor("Green");

        await interaction.reply({ embeds: [embed] });
    }
};
