const { ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require('discord.js');
const { configuracao, estatisticas, } = require('../DataBaseJson');
const axios = require('axios');
const { JsonDatabase } = require('wio.db');


async function Varredura(client) {
    
    if (configuracao.get('ConfigChannels.systemlogs') == null) return;
    if (configuracao.get('pagamentos.MpAPI') == null) return;

    const embed3 = new EmbedBuilder()
        .setColor('#1c44ff')
        .setTitle(`Anti-Fraude`)
        .setDescription(`O bot está realizando uma varredura nos pagamentos para verificar a existência de quaisquer reembolsos suspeitos.`)
        .setFooter({ iconURL: `https://media.discordapp.net/attachments/1237227861069398059/1237548995274870804/03-19-26-213_512.gif?ex=663c0cd1&is=663abb51&hm=27cc1f7dee424325f8caa904683495daa8033d49cca4df2f083782f7b79b601f&=&width=384&height=384`, text: `Sistema Anti-Fraude` })
        .setTimestamp();

    const row222 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('asSs')
                .setLabel('Mensagem do Sistema')
                .setStyle(2)
                .setDisabled(true)
        );

    const channel = await client.channels.fetch(configuracao.get('ConfigChannels.systemlogs'));
    await channel.send({ components: [row222], embeds: [embed3] });

    const refundResponse = await axios.get('https://api.mercadopago.com/v1/payments/search', {
        params: {
            'access_token': `APP_USR-8496945370677420-040418-b793f397b495a470ad70a0e0fe8c6906-1750390247`,
            'status': 'refunded'
        }
    });

    const dd = refundResponse.data.results;

 
    const refounds = new JsonDatabase({
        databasePath: "./DataBaseJson/refounds.json"
      });


      for (const element of dd) {
        const isRefunded = await refounds.get(`${element.id}`);
    
        if (!isRefunded) {
            await refounds.set(`${element.id}`, `Reembolsado`);
    
            let id = await element.external_reference
            if (element.external_reference == null) {
                id = 'Não encontrado'
            }
    
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(` Reembolso Detectado`)
                .setDescription(`Um reembolso foi detectado no sistema de pagamentos.`)
                .addFields(
                    { name: `**ID do pagamento**`, value: `\`${element.id}\``, inline: true },
                    { name: `**ID do usuário**`, value: `\`${id}\``, inline: true },
                    { name: `**Valor**`, value: `\`${element.transaction_amount}\``, inline: true },
                    { name: `**Data**`, value: `<t:${Math.ceil(Date.now() / 1000)}:R>`, inline: true },
                    { name: `**Status**`, value: `\`${element.status}\``, inline: true },
                    { name: `**Tipo de pagamento**`, value: `\`${element.payment_type_id}\``, inline: true },
                    { name: `**Tipo de operação**`, value: `\`${element.operation_type}\``, inline: true },
                );
    
            try {
                await channel.send({ components: [row222], embeds: [embed] });
            } catch (error) {
                console.error('Erro ao enviar a mensagem:', error);
            }
    
            const estatisticasData = estatisticas.fetchAll();
            for (const element2 of estatisticasData) {
                if (element2.data.idpagamento === element.id) {
                    estatisticas.delete(element2.ID);
                }
            }
        }
      }
    }
    


module.exports = {
    Varredura
};
