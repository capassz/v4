const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder, InteractionType } = require("discord.js");
const Discord = require("discord.js")

async function Gerenciar(interaction, client) {


    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configcargos")
                .setLabel('ㅤㅤConfigurar Cargosㅤㅤ')
                .setStyle(1),

            new ButtonBuilder()
                .setCustomId("personalizarcanais")
                .setLabel('ㅤㅤConfigurar Canaisㅤㅤ')
                .setStyle(1),

        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("personalizarantifake")
                .setLabel('ㅤㅤConfigurar Anti-Fakeㅤㅤ')
                .setStyle(1),

            new ButtonBuilder()
                .setCustomId("formasdepagamentos")
                .setLabel('Formas de pagamento')
                .setStyle(1),

        )

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltar1")
                .setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤVoltarㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ')
                .setStyle(2)
        )
        

    if (interaction.message == undefined) {
        interaction.reply({ embeds: [], components: [row1, row2, row3], content: `Oque deseja configurar?` })
    } else {
        interaction.update({ embeds: [], components: [row1, row2, row3], content: `Oque deseja configurar?` })
    }

}


module.exports = {
    Gerenciar
}
