import { Client } from "discord.js";

// Slash Command Interface
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, ChatInputCommandInteraction, ContextMenuCommandBuilder } from "discord.js";

export interface commandType { // Type interface for the slash command //
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | ContextMenuCommandBuilder;
    run: (interaction: ChatInputCommandInteraction, client: Client) => Promise<void>; // The brains of the command (always async)
}