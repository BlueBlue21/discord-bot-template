import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

import { commandType } from "../types/Interactions";

export = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    run: async ( interaction, client ) => {
        const embed = new EmbedBuilder()
            .setTitle("Ping!")
            .setDescription(`Pong! **(${client.ws.ping}ms!)**`)
            .setTimestamp()
            .setColor("Green");

        await interaction.reply({ embeds: [embed] });
    }
} as commandType;
