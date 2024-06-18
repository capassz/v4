const { JsonDatabase } = require("wio.db");
const dbPerms = new JsonDatabase({ databasePath: "./DataBaseJson/perm.json" });
const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const startTime = Date.now();
const maxMemory = 100;
const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
const memoryUsagePercentage = (usedMemory / maxMemory) * 100;
const roundedPercentage = Math.min(100, Math.round(memoryUsagePercentage));
const { Painel } = require("../../Functions/Painel");
const { pedidos, pagamentos, carrinhos, configuracao, produtos } = require("../../DataBaseJson");

module.exports = {
  name: "entregar",
  description: "Use para aprovar manualmente",
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

    if (carrinhos.has(interaction.channel.id) == false) return interaction.reply({ content: ` Não há um carrinho aberto neste canal.`, ephemeral: true })


    const yy = await carrinhos.get(interaction.channel.id)

    const hhhh = produtos.get(`${yy.infos.produto}.Campos`)
    const gggaaa = hhhh.find(campo22 => campo22.Nome === yy.infos.campo)


    let valor = 0

    if (yy.cupomadicionado !== undefined) {
      const valor2 = gggaaa.valor * yy.quantidadeselecionada

      const hhhh2 = produtos.get(`${yy.infos.produto}.Cupom`)
      const gggaaaawdwadwa = hhhh2.find(campo22 => campo22.Nome === yy.cupomadicionado)
      valor = valor2 * (1 - gggaaaawdwadwa.desconto / 100);
    } else {
      valor = gggaaa.valor * yy.quantidadeselecionada
    }




    const mandanopvdocara = new EmbedBuilder()
      .setColor(`${configuracao.get(`Cores.Processamento`) == null ? `#fcba03` : configuracao.get(`Cores.Processamento`)}`)
      .setAuthor({ name: `Pedido #Aprovado Manualmente` })
      .setTitle(`🛍 Pedido solicitado`)
      .setFooter(
        { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
      )
      .setTimestamp()
      .setDescription(`Seu pedido foi criado e agora está aguardando a confirmação do pagamento`)
      .addFields(
        { name: `**Detalhes**`, value: `\`${yy.quantidadeselecionada}x ${yy.infos.produto} - ${yy.infos.campo} R$ ${Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`` }
      )

    try {
      await interaction.user.send({ embeds: [mandanopvdocara] })
    } catch (error) {

    }



    const dsfjmsdfjnsdfj = new EmbedBuilder()
      .setColor(`${configuracao.get(`Cores.Processamento`) == null ? `#fcba03` : configuracao.get(`Cores.Processamento`)}`)
      .setAuthor({ name: `Pedido #Aprovado Manualmente` })
      .setTitle(`🛍 Pedido solicitado`)
      .setDescription(`Usuário ${interaction.user} solicitou um pedido`)
      .addFields(
        { name: `**Detalhes**`, value: `\`${yy.quantidadeselecionada}x ${yy.infos.produto} - ${yy.infos.campo} R$ ${Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`` },
        { name: `**Forma de pagamento**`, value: `Manualmente` }
      )
      .setFooter(
        { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
      )
      .setTimestamp()





    try {
      const channela = await client.channels.fetch(configuracao.get(`ConfigChannels.logpedidos`));
      await channela.send({ embeds: [dsfjmsdfjnsdfj] }).then(yyyyy => {
        carrinhos.set(`${interaction.channel.id}.replys`, { channelid: yyyyy.channel.id, idmsg: yyyyy.id })
      })
    } catch (error) {

    }

    pagamentos.set(`${interaction.channel.id}`, { pagamentos: { id: `Aprovado Manualmente`, method: `pix`, data: Date.now() } })
    interaction.reply({ content: ` Pagamento aprovado manualmente. Aguarde..`, ephemeral: true })

  }
}
