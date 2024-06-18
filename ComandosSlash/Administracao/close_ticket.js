const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { GerenciarCampos } = require("../../Functions/GerenciarCampos");
const { JsonDatabase } = require("wio.db");
const dbPerms = new JsonDatabase({ databasePath: "./DataBaseJson/perm.json" });
const Discord = require("discord.js")

module.exports = {
  name: "close_ticket",
  description: "Use para fechar um ticket",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "reason",
      description: "-",
      type: Discord.ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, interaction, message) => {

        // user without permission for dbPerms (wio.db)
        if (!dbPerms.has(interaction.user.id)) {
            await interaction.reply({
                content: `❌ Você não tem permissão para usar este comando.`,
                ephemeral: true
            });
            return;
        };


    const reasonaaa = interaction.options.getString('reason')


    if (interaction.channel.isThread()) {
      const ultimoIndice = interaction.channel.name.lastIndexOf('・');
      const ultimosNumeros = interaction.channel.name.slice(ultimoIndice + 1);
      await interaction.channel.delete()
      try {
        const user = await client.users.fetch(ultimosNumeros)
        await user.send({content:`Olá <@!${ultimosNumeros}> seu ticket foi fechado por ${interaction.user}.\n**Motivo:**\n${reasonaaa == null ? `Nenhum motivo declarado!` : reasonaaa}`})
      } catch (error) {
        
      }
    } else {
      interaction.reply({ content: ` Esse canal não é um ticket.`, ephemeral: true })
    }


  }
}
