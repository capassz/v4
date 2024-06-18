const { ActionRowBuilder, TextInputBuilder, TextInputStyle, InteractionType, ModalBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const { configuracao } = require("../DataBaseJson");



async function FormasDePagamentos(interaction) {

    const TirardaArrayBancosBloqueados = configuracao.get(`pagamentos.BancosBloqueados`)
    let BancosBloqueados = ``
    if (TirardaArrayBancosBloqueados !== null) {
        for (let i = 0; i < TirardaArrayBancosBloqueados.length; i++) {
            BancosBloqueados += `🟢 ${TirardaArrayBancosBloqueados[i]}\n`
        }
    }

    const embed = new EmbedBuilder()
    .setTitle(`Configurar formas de pagamento`)
    .setFields(
        { name: `Mercado Pago TOKEN`, value: `${configuracao.get(`pagamentos.MpAPI`) == null ? `\`🔴 Não configurado\`` : `\`🟢 ${configuracao.get(`pagamentos.MpAPI`)}\``}`, inline: false },
        { name: `Bancos Bloqueados`, value: `${BancosBloqueados == `` ? `\`🔴 Nenhum Banco\`` : `\`${BancosBloqueados}\``}`, inline: false }
    )
    .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc' : configuracao.get('Cores.Principal')}`)
    .setFooter(
        { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
    )
    .setTimestamp();

if (configuracao.get(`pagamentos.SemiAutomatico.status`) == false) {
    embed.addFields(
        { name: `Pagamento manual`, value: `\`🔴 Não configurado\``, inline: false },
        { name: `Chave pix definida`, value: `\`🔴 Não configurado\``, inline: false }
    );
}

    if (configuracao.get(`pagamentos.SemiAutomatico.status`) == true) {
        embed.addFields({ name: `Pagamento manual`, value: `\`🟢 ${configuracao.get(`pagamentos.SemiAutomatico.msg`)}\``})
        embed.addFields({ name: `Chave pix definida`, value: `\`🟢 ${configuracao.get(`pagamentos.SemiAutomatico.pix`)}\``})
    }


    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configurarmercadopago")
                .setLabel('Configurar Mercado Pago')
                .setEmoji(`1178086608004722689`)
                .setStyle(1),

            new ButtonBuilder()
                .setCustomId("formasdepagamentos")
                .setLabel('Editar endereços de Crypto')
                .setEmoji(`1193427302311264318`)
                .setDisabled(true)
                .setStyle(1)
        )
    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltaradawdwa")
                .setLabel('Voltar')
                .setEmoji(`1178068047202893869`)
                .setStyle(2)

        )

    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ConfigurarPagamentoManual")
                .setLabel('Configurar Pagamento Manual')
                .setEmoji(`1193427093158105129`)
                .setStyle(1)

        )

    await interaction.update({ content: ``, embeds: [embed], ephemeral: true, components: [row2, row4, row3] })

}

module.exports = {
    FormasDePagamentos
}