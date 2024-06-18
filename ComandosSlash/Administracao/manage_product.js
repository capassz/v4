const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { GerenciarCampos } = require("../../Functions/GerenciarCampos");
const { JsonDatabase } = require("wio.db");
const dbPerms = new JsonDatabase({ databasePath: "./DataBaseJson/perm.json" });

module.exports = {
  name: "product",
  description: "Use para configurar produtos",
  type: ApplicationCommandType.ChatInput,
  options: [{ name: "product", description: "-", type: 3, required: true, autocomplete: true }],

  run: async (client, interaction, message) => {

        // user without permission for dbPerms (wio.db)
        if (!dbPerms.has(interaction.user.id)) {
            await interaction.reply({
                content: `❌ Você não tem permissão para usar este comando.`,
                ephemeral: true
            });
            return;
        };

    if (interaction.options._hoistedOptions[0].value == 'nada') return interaction.reply({ content: `Nenhum item registrado em seu BOT`, ephemeral: true })


    GerenciarCampos(interaction, interaction.options._hoistedOptions[0].value)


  }
}
