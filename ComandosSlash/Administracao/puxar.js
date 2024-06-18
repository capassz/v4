const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { JsonDatabase } = require("wio.db");
const { url, clientid, secret } = require("../../DataBaseJson/configauth.json");
const dbPerms = new JsonDatabase({ databasePath: "./DataBaseJson/perm.json" });
const users = new JsonDatabase({ databasePath: "./DataBaseJson/users.json" });
const axios = require("axios");
const discordOauth = require("discord-oauth2");
const oauth = new discordOauth();
const FormData = require('form-data');

module.exports = {
    name: "push",
    description: "Coloque os membros em algum servidor.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "servidor",
            description: "Coloque o ID do Servidor",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {
        if (!dbPerms.has(interaction.user.id)) {
            await interaction.reply({
                content: `❌ Você não tem permissão para usar este comando.`,
                ephemeral: true
            });
            return;
        }

        const all = (await users.all()).filter(a => a.data.username);
        const guild_id = interaction.options.getString("servidor") || interaction.guild.id;
        const guild = interaction.client.guilds.cache.get(guild_id);

        if (!guild) {
            console.log(`Guild ID ${guild_id} not found.`);
            return interaction.reply({ content: `Servidor não Encontrado.`, ephemeral: true });
        }

        let yes = 0;
        let no = 0;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`🔄 Puxando Usuarios...`)
            ],
            ephemeral: true
        });

        const updateMessage = async () => {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`🔄 Puxando Usuarios...`)
                ]
            });
        };

        const chunkSize = 10;
        for (let i = 0; i < all.length; i += chunkSize) {
            const chunk = all.slice(i, i + chunkSize);
            await Promise.all(chunk.map(async user => {
                try {
                    const userToken = await renewUserToken(user.ID, user.data.refreshToken, user.data.code);
                    await oauth.addMember({
                        accessToken: userToken?.access_token ?? user.data.acessToken,
                        botToken: client.token,
                        guildId: guild.id,
                        userId: user.ID,
                        nickname: user.data.username,
                        roles: [],
                        mute: false,
                        deaf: false
                    });
                    yes++;
                    await users.set(`${user.ID}.acessToken`, userToken?.access_token ?? user.data.acessToken);
                    await users.set(`${user.ID}.refreshToken`, userToken?.refresh_token ?? user.data.refreshToken);
                } catch (err) {
                    no++;
                    console.error(err);
                }
            }));
            await updateMessage();
        }

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} Usuários Puxados.`)
                    .addFields(
                        { name: "Total Verificados", value: `Total de Usuários: **(\`${all.length}\`)**` },
                        { name: "Puxados", value: `Puxados com Sucesso: **(\`${yes}\`)**` },
                        { name: "Erros", value: `Mal-Sucedido: **(\`${no}\`)**` }
                    )
            ]
        });

    }
}

async function renewUserToken(userId, refreshToken, code) {
    try {
        const response = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: clientid,
                code,
                client_secret: secret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                redirect_uri: 'https://nyxauthapi.squareweb.app/callback',
                scope: 'identify'
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        if (response.data && response.data.access_token) {
            return { access_token: response.data.access_token, refresh_token: response.data.refresh_token };
        } else {
            return { access_token: null, refresh_token: null };
        }
    } catch (error) {
        console.error('Error renewing token:', error);
        return { access_token: null, refresh_token: null };
    }
}
