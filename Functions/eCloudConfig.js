const { ApplicationCommandType, EmbedBuilder, Webhook, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = require("discord.js")
const { owner, url, clientid, secret, webhook_logs, role, guild_id } = require("../DataBaseJson/configauth.json");
const { JsonDatabase } = require("wio.db");
const users = new JsonDatabase({ databasePath: "./DataBaseJson/users.json" });
const axios = require("axios");
const discordOauth = require("discord-oauth2");
const oauth = new discordOauth();


async function ecloud(interaction, client) {

    const all = await users.all().filter(a => a.data.username);
    const uri = oauth.generateAuthUrl({
        clientId: clientid,
        clientSecret: secret,
        scope: ["identify", "guilds.join"],
        redirectUri: `${url}/auth/callback`
    });
    const embed = new EmbedBuilder().setTitle(`💨 — Painel de Config eCloud`)
        .setColor("Blue")
        .setTitle(`Meu eCloud Drive`)
        .setDescription(`A sincronização está ativada, garantindo que os dados do seu servidor (Canais,
            cargos, permissões, mensagens e configurações) sejam continuamente salvos na
            nuvem do seu eCloud Drive.`)
        .addFields(
            {
                name: "⚙ Seu bot OAuth2",   
                value: ` `,
                inline: true
            },
            {
                name: "👥 Membros OAuth2",   
                value: `**(\`${all.length}\`)**`,
                inline: true
            },
            {
                name: "Logs Webhook:",
                value: `||${webhook_logs}||`,
                inline: true
            },

           /* {
                name: "Cargo",
                value: `\`${role}\``,
                inline: true
            },
            {
                name: "Client ID:",
                value: `\`${clientid}\``,
                inline: true
            },
            {
                name: "Secret:",
                value: `||${secret}||`,
                inline: true
            },
            {
                name: "ID Servidor",
                value: `\`${guild_id}\``,
                inline: true
            },*/
            {
                name: "⚠ Aviso Importante",   
                value: `Você ainda tem **(\`${all.length}\`)** membros em seu eCloud Driver. Esses membros não foram
                perdidos, mas só podem ser recuperados através do suporte por questões de
                segurança. Consulte esta mensagem para mais informações. Recomendamos a
                atualização do seu sistema de autenticação para o novo **eCloud Independente**,
                que será exclusivamente seu, permitindo que você tenha total controle sobre seu
                membros sem limitações futuras.`,
                inline: true
            }, 
        );


        const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("configauth")
            .setLabel('ㅤㅤVincular Bot OAuth2ㅤㅤ')
            .setStyle(1),
            new ButtonBuilder()
            .setLabel('Tutorial')
            .setEmoji(`1120499019941167104`)
            .setURL("https://discord.gg/posse")
            .setStyle(5),
        )
        const row3 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("voltar1")
                .setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤVoltarㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ')
                .setStyle(2)

        )

 /*   const row2 = new ActionRowBuilder()
    
        .addComponents(
                new ButtonBuilder()
                    .setCustomId("roleedit")
                    .setLabel('Editar Cargo')
                    .setEmoji(`1240459731584290929`)
                    .setStyle(1),
            new ButtonBuilder()
                .setCustomId("webedit")
                .setLabel('Editar Webhook')
                .setEmoji(`1240458448341307442`)
                .setDisabled(false)
                .setStyle(1)
        )

        const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("secretedit")
            .setLabel('Editar Secret')
            .setEmoji(`1240450763595976715`)
            .setStyle(3),
            new ButtonBuilder()
            .setCustomId("svedit")
            .setLabel('Editar ID SERVIDOR')
            .setEmoji(`1237422648598724638`)
            .setStyle(3),
            new ButtonBuilder()
            .setCustomId("idedit")
            .setLabel('Editar ID')
            .setEmoji(`1240479019607134328`)
            .setStyle(3)
        )
    const row3 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
            .setLabel('Tutorial')
            .setEmoji(`1240456000071532626`)
            .setStyle(5)
            .setURL("https://discord.gg/membros"),
            new ButtonBuilder()
                .setCustomId("voltar1")
                .setLabel('Voltar')
                .setEmoji(`1178068047202893869`)
                .setStyle(2)

        )
        client.on("interactionCreate", async interaction => {
            if (!interaction.isButton()) return;
            
            // Verifique se o botão pressionado é o "webedit"
            if (interaction.customId === "webedit") {
                await interaction.deferReply({ ephemeral: true });
        
                // Simplesmente enviar uma mensagem pedindo a nova URL do webhook
                await interaction.followUp("**🔄 Insira a nova URL do webhook.**");
        
                // Aguarde uma nova interação (mensagem do usuário)
                const filter = m => m.author.id === interaction.user.id;
                const response = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000 });
        
                // Verifique se a mensagem foi recebida
                if (response.size === 0) {
                    await interaction.editReply("**🔔 Tempo esgotado. Por favor, tente novamente.**");
                    return;
                }
        
                const newWebhookURL = response.first().content;
        
                // Atualize o arquivo de configuração com a nova URL do webhook
                const fs = require('fs');
                const path = require('path');
                const configPath = path.join(__dirname, '..', 'DataBaseJson', 'configauth.json');
                
                try {
                    const config = require(configPath);
                    config.webhook_logs = newWebhookURL;
                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                
                    await interaction.editReply("** WEBHOOK atualizada com sucesso.**\n\`Talvez, ela não apareça na embed do seu eCloud, tente reiniciar seu bot.\`");
                } catch (error) {
                    console.error("Erro ao atualizar a webhook:", error);
                    await interaction.editReply("** Ocorreu um erro ao atualizar a WEBHOOK.**");
                }
            }
        });
        client.on("interactionCreate", async interaction => {
            if (!interaction.isButton()) return;
            
            // Verifique se o botão pressionado é o "webedit"
            if (interaction.customId === "roleedit") {
                await interaction.deferReply({ ephemeral: true });
        
                // Simplesmente enviar uma mensagem pedindo a nova URL do webhook
                await interaction.followUp("**🔄 Envie o id do cargo de verificado.**");
        
                // Aguarde uma nova interação (mensagem do usuário)
                const filter = m => m.author.id === interaction.user.id;
                const response = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000 });
        
                // Verifique se a mensagem foi recebida
                if (response.size === 0) {
                    await interaction.editReply("**🔔 Tempo esgotado. Por favor, tente novamente.**");
                    return;
                }
        
                const newRoleID = response.first().content;
        
                // Atualize o arquivo de configuração com a nova URL do webhook
                const fs = require('fs');
                const path = require('path');
                const configPath = path.join(__dirname, '..', 'DataBaseJson', 'configauth.json');
                
                try {
                    const config = require(configPath);
                    config.role = newRoleID;
                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                
                    await interaction.editReply("** CARGO atualizado com sucesso.**\n\`Talvez, ela não apareça na embed do seu eCloud, tente reiniciar seu bot.\`\n\n🔔 **O cargo do bot deve estar ACIMA do cargo de verificado!**");
                } catch (error) {
                    console.error("Erro ao atualizar o cargo:", error);
                    await interaction.editReply("** Ocorreu um erro ao atualizar o CARGO.**");
                }
            }
        });
        client.on("interactionCreate", async interaction => {
            if (!interaction.isButton()) return;
            
            // Verifique se o botão pressionado é o "webedit"
            if (interaction.customId === "idedit") {
                await interaction.deferReply({ ephemeral: true });
        
                // Simplesmente enviar uma mensagem pedindo a nova URL do webhook
                await interaction.followUp("**🔄 Envie o id do BOT.**");
        
                // Aguarde uma nova interação (mensagem do usuário)
                const filter = m => m.author.id === interaction.user.id;
                const response = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000 });
        
                // Verifique se a mensagem foi recebida
                if (response.size === 0) {
                    await interaction.editReply("**🔔 Tempo esgotado. Por favor, tente novamente.**");
                    return;
                }
        
                const newID = response.first().content;
        
                // Atualize o arquivo de configuração com a nova URL do webhook
                const fs = require('fs');
                const path = require('path');
                const configPath = path.join(__dirname, '..', 'DataBaseJson', 'configauth.json');
                
                try {
                    const config = require(configPath);
                    config.clientid = newID;
                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                
                    await interaction.editReply("** ID atualizado com sucesso.**\n\`Talvez, ela não apareça na embed do seu eCloud, tente reiniciar seu bot.\`\n🔔 **Lembre-se este é o id do BOT!**");
                } catch (error) {
                    console.error("Erro ao atualizar o arquivo de id do bot:", error);
                    await interaction.editReply("** Ocorreu um erro ao atualizar o ID.**");
                }
            }
        });
        client.on("interactionCreate", async interaction => {
            if (!interaction.isButton()) return;
            
            // Verifique se o botão pressionado é o "webedit"
            if (interaction.customId === "secretedit") {
                await interaction.deferReply({ ephemeral: true });
        
                // Simplesmente enviar uma mensagem pedindo a nova URL do webhook
                await interaction.followUp("**🔄 Envie o SECRET do BOT.**");
        
                // Aguarde uma nova interação (mensagem do usuário)
                const filter = m => m.author.id === interaction.user.id;
                const response = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000 });
        
                // Verifique se a mensagem foi recebida
                if (response.size === 0) {
                    await interaction.editReply("**🔔 Tempo esgotado. Por favor, tente novamente.**");
                    return;
                }
        
                const newID = response.first().content;
        
                // Atualize o arquivo de configuração com a nova URL do webhook
                const fs = require('fs');
                const path = require('path');
                const configPath = path.join(__dirname, '..', 'DataBaseJson', 'configauth.json');
                
                try {
                    const config = require(configPath);
                    config.clientid = newID;
                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                
                    await interaction.editReply("** SECRET atualizado com sucesso.**\n\`Talvez, ele não apareça na embed do seu eCloud, tente reiniciar seu bot.\`");
                } catch (error) {
                    console.error("Erro ao atualizar o secret:", error);
                    await interaction.editReply("** Ocorreu um erro ao atualizar o SECRET.**");
                }
            }
        });
        client.on("interactionCreate", async interaction => {
            if (!interaction.isButton()) return;
            
            // Verifique se o botão pressionado é o "webedit"
            if (interaction.customId === "svedit") {
                await interaction.deferReply({ ephemeral: true });
        
                // Simplesmente enviar uma mensagem pedindo a nova URL do webhook
                await interaction.followUp("**🔄 Envie o ID do SERVIDOR.**");
        
                // Aguarde uma nova interação (mensagem do usuário)
                const filter = m => m.author.id === interaction.user.id;
                const response = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000 });
        
                // Verifique se a mensagem foi recebida
                if (response.size === 0) {
                    await interaction.editReply("**🔔 Tempo esgotado. Por favor, tente novamente.**");
                    return;
                }
        
                const newSV = response.first().content;
        
                // Atualize o arquivo de configuração com a nova URL do webhook
                const fs = require('fs');
                const path = require('path');
                const configPath = path.join(__dirname, '..', 'DataBaseJson', 'configauth.json');
                
                try {
                    const config = require(configPath);
                    config.guild_id = newSV;
                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                
                    await interaction.editReply("** SERVIDOR atualizado com sucesso.**\n\`Talvez, ele não apareça na embed do seu eCloud, tente reiniciar seu bot.\`");
                } catch (error) {
                    console.error("Erro ao atualizar o id guild:", error);
                    await interaction.editReply("** Ocorreu um erro ao atualizar o SERVIDOR.**");
                }
            } 
        });   */     


    
        
        
        
    await interaction.update({ content: ``, embeds: [embed], ephemeral: true, components: [row2, row3]/* row4, row3]*/ })
}


module.exports = {
    ecloud
}
