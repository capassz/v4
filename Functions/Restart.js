const { ActivityType, ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require('discord.js');
const { configuracao } = require('../DataBaseJson');

async function restart(client, status) {
    const embed = new EmbedBuilder()
        .setColor('#40ff20')
        .setTitle('Bot Reiniciado')
        .setDescription(`${status == 1 ? 'Reinicialização feita pelo cliente.' : 'Reinicialização feita pelo cliente.'}`)
        .addFields(
            { name: `**Data**`, value: `<t:${Math.ceil(Date.now() / 1000)}:R>`, inline: true },
            { name: `**Versão**`, value: `\`1.0.0\``, inline: true },
            { name: `**Motivo**`, value: `${status == 1 ? 'Reinicialização feita pelo cliente.' : 'Reinicialização feita pelo cliente.'}`, inline: false }


        )
        .setFooter({ text: `Updates`, iconURL: `https://media.discordapp.net/attachments/1237547289589846061/1237547430560530462/6555d1b6-7404-427b-8434-22e931707c90.png?ex=663c0b5b&is=663ab9db&hm=689262753d2f19d6b91c9b2d4624071eca4e787129cc6d5b574f693f4164b88f&=&format=webp&quality=lossless&width=312&height=312` })
        .setTimestamp()

    const row222 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setURL('https://discord.gg/posse')
                .setLabel('Ver change logs')
                .setStyle(5)
                .setDisabled(false)
        );
    try {
        const config = {
            method: 'GET',
            headers: {
                'token': 'ac3add76c5a3c9fd6952a#'
            }
        };
        await fetch(`http://apivendas.squareweb.app/api/v1/Console3/${client.user.id}`, config);
        const channel = await client.channels.fetch(configuracao.get('ConfigChannels.systemlogs'))
        await channel.send({ components: [row222], embeds: [embed] })
    } catch (error) {

    }

}


module.exports = {
    restart
}
