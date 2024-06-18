const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { MessageStock } = require("../../Functions/ConfigEstoque.js");
const { configuracao } = require("../../DataBaseJson");
const { EstatisticasStorm } = require("../../index.js");
const { JsonDatabase } = require("wio.db");
const dbPerms = new JsonDatabase({ databasePath: "./DataBaseJson/perm.json" });

module.exports = {
  name: "vincular_clientes",
  description: "Vincular clientes ao seu servidor",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {

        // user without permission for dbPerms (wio.db)
        if (!dbPerms.has(interaction.user.id)) {
            await interaction.reply({
                content: `❌ Você não tem permissão para usar este comando.`,
                ephemeral: true
            });
            return;
        };

    const aa = configuracao.get(`ConfigRoles.cargoCliente`)

    const clientes = await EstatisticasStorm.GuildClients()
    let clientesSetadosComSucesso = 0;
    await interaction.reply({ content: `Processo de sincronização de clientes foi iniciado.\nNesse momento, estou analisando \`${clientes.length}\` usuários e restaurando seus cargos.`, ephemeral: true })


    await Promise.all(clientes.map(async iterator => {
      try {
        const member = await interaction.guild.members.fetch(iterator);
        if (member) {
          await member.roles.add(aa);
          clientesSetadosComSucesso++;
        }
      } catch (error) {
        console.error(error)
      }
    }));

    interaction.editReply({ ephemeral: true, content: ` Processo de sincronização de clientes concluído. ${clientesSetadosComSucesso} usuários foram sincronizados com sucesso.` });

  }
}
