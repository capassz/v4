const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { produtos, configuracao } = require("../DataBaseJson");
const startTime = Date.now();
const maxMemory = 100;
const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
const memoryUsagePercentage = (usedMemory / maxMemory) * 100;
const roundedPercentage = Math.min(100, Math.round(memoryUsagePercentage));

async function Painel(interaction, client) {

  const embed = new EmbedBuilder()
    .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc' : configuracao.get('Cores.Principal')}`)
    .setTitle(`📝 — Painel de config do seu ${client.user.username}`)
    .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
    .setDescription(`Olá, senhor(a) ${interaction.user}, o que deseja fazer?`)
    .addFields(
      { name: `**Versão do Bot**`, value: `2.0.0`, inline: true },
      { name: `**Ping**`, value: `\`${await client.ws.ping} MS\``, inline: true },
      { name: `**Uptime**`, value: `<t:${Math.ceil(startTime / 1000)}:R>`, inline: true },
    )
    .setFooter(
      { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
    )
    .setTimestamp();


  const row2 = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId("painelconfigticket")
        .setLabel('Ticket system')
        .setStyle(4)
        .setDisabled(false),
      new ButtonBuilder()
        .setCustomId("painelconfigvendas")
        .setLabel('Sales system')
        .setStyle(3)
        .setDisabled(false),
      new ButtonBuilder()
        .setCustomId("painelconfigbv")
        .setLabel('Welcome Settings')
        .setStyle(4)
        .setDisabled(false),

    )

  const row3 = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId("painelpersonalizar")
        .setLabel('Personalizar bot')
        .setEmoji(`1178066208835252266`)
        .setStyle(2)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("rendimento")
        .setLabel('Meus Rendimentos')
        .setEmoji(`1178086986360307732`)
        .setStyle(2)
        .setDisabled(false),
    )

  const row4 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("ecloud")
        .setLabel('ㅤㅤOAuth2ㅤㅤ')
        .setStyle(1)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("gerenciarconfigs")
        .setLabel('ㅤㅤConfiguraçõesㅤㅤ')
        .setStyle(1)
        .setDisabled(false),
    )

  if (interaction.message == undefined) {
    interaction.reply({ content: ``, components: [row2, row3, row4], embeds: [embed], ephemeral: true })
  } else {
    interaction.update({ content: ``, components: [row2, row3, row4], embeds: [embed], ephemeral: true })
  }
}

async function Gerenciar2(interaction, client) {

  const ggg = produtos.valueArray();


  const embed = new EmbedBuilder()
    .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc' : configuracao.get('Cores.Principal')}`)
    .setTitle(`Painel de Administração`)
    .setDescription(`Senhor(a) **${interaction.user.username}**, escolha o que deseja fazer.`)
    .addFields(
      { name: `**Total de produtos fornecidos**`, value: `${ggg.length}`, inline: true },
    )
    .setFooter(
      { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
    )
    .setTimestamp()

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("criarrrr")
        .setLabel('Criar')
        .setEmoji(`1178067873894236311`)
        .setStyle(1),

      new ButtonBuilder()
        .setCustomId("gerenciarotemae")
        .setLabel('Gerenciar')
        .setEmoji(`1178067945855910078`)
        .setStyle(1),

      new ButtonBuilder()
        .setCustomId("gerenciarposicao")
        .setLabel('Posições')
        .setEmoji(`1178086608004722689`)
        .setStyle(1),

    )

  const row3 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("voltar00")
        .setLabel('Voltar')
        .setEmoji(`1178068047202893869`)
        .setStyle(2)
    )



  await interaction.update({ embeds: [embed], components: [row2, row3], content: `` })



}



module.exports = {
  Painel,
  Gerenciar2
}
