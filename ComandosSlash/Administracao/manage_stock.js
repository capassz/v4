const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { MessageStock } = require("../../Functions/ConfigEstoque.js");
const { JsonDatabase } = require("wio.db");
const dbPerms = new JsonDatabase({ databasePath: "./DataBaseJson/perm.json" });

module.exports = {
  name: "stock",
  description: "Use para adicionar stock",
  type: ApplicationCommandType.ChatInput,
  options: [{ name: "item", description: "-", type: 3, required: true, autocomplete: true }],

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


    const separarpor_ = interaction.options._hoistedOptions[0].value.split('_')
    const produtoname = separarpor_[0]
    const camponame = separarpor_[1]

    MessageStock(interaction, 1, produtoname, camponame)

  }
}
