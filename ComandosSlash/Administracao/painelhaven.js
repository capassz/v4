const { 
    ApplicationCommandType, 
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder, 
    EmbedBuilder, 
    PermissionFlagsBits, 
    ComponentType, 
    StringSelectMenuBuilder 
} = require('discord.js');

module.exports = {
    name: 'new',
    description: 'envie um texto com imagem e botões',
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true });
            return;
        }

        const askQuestion = async (question) => {
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setDescription(question);

            const button = new ButtonBuilder()
                .setCustomId('answer')
                .setLabel('Responder')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            const message = await interaction.followUp({ embeds: [embed], components: [row], fetchReply: true });

            const filter = (i) => i.user.id === interaction.user.id && i.customId === 'answer';
            const collected = await message.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000 });

            await collected.deferUpdate();

            const responseMessage = await interaction.channel.send('Por favor, insira sua resposta:');
            const responseFilter = (m) => m.author.id === interaction.user.id;
            const responseCollected = await interaction.channel.awaitMessages({ filter: responseFilter, max: 1, time: 60000, errors: ['time'] });

            return responseCollected.first().content;
        };

        try {
            const texto = await askQuestion('Por favor, insira o texto da mensagem:');
            const imagem = await askQuestion('Por favor, insira o link da imagem:');
            const text1 = await askQuestion('Por favor, insira o texto do botão um:');
            const text2 = await askQuestion('Por favor, insira o texto do botão dois:');
            const link1 = await askQuestion('Por favor, insira o link do botão um:');
            const link2 = await askQuestion('Por favor, insira o link do botão dois:');
            const emoji1 = await askQuestion('Por favor, insira o emoji do botão um:');
            const emoji2 = await askQuestion('Por favor, insira o emoji do botão dois:');

            const button1 = new ButtonBuilder()
                .setLabel(text1)
                .setStyle(ButtonStyle.Link)
                .setURL(link1)
                .setEmoji(emoji1);

            const button2 = new ButtonBuilder()
                .setLabel(text2)
                .setStyle(ButtonStyle.Link)
                .setURL(link2)
                .setEmoji(emoji2);

            const row = new ActionRowBuilder().addComponents(button1, button2);

            const embed = new EmbedBuilder()
                .setDescription(texto)
                .setImage(imagem);

            await interaction.channel.send({ embeds: [embed], components: [row] });
            await interaction.followUp('Mensagem enviada com sucesso!', { ephemeral: true });
        } catch (error) {
            await interaction.followUp('Ocorreu um erro ao coletar as respostas ou o tempo esgotou.', { ephemeral: true });
        }
    }
};
