const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const Discord = require("discord.js");
const { MessageStock } = require("../../Functions/ConfigEstoque.js");
const { produtos } = require("../../DataBaseJson");
const { JsonDatabase } = require("wio.db");
const dbPerms = new JsonDatabase({ databasePath: "./DataBaseJson/perm.json" });

module.exports = {
  name: "mass_cupons",
  description: "Crie vários cupons",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "name",
      description: "-",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "discount",
      description: "-",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "days",
      description: "-",
      type: Discord.ApplicationCommandOptionType.Number,
      required: false,
    },
    {
      name: "max_uses",
      description: "-",
      type: Discord.ApplicationCommandOptionType.Number,
      required: false,
    },
    {
      name: "amount",
      description: "-",
      type: Discord.ApplicationCommandOptionType.Number,
      required: false,
    },
    {
      name: "role",
      description: "-",
      type: Discord.ApplicationCommandOptionType.Role,
      required: false,
    },
    {
      name: "buy_amount_max",
      description: "-",
      type: Discord.ApplicationCommandOptionType.Number,
      required: false,
    },
    {
      name: "buy_amount",
      description: "-",
      type: Discord.ApplicationCommandOptionType.Number,
      required: false,
    },

  ],

  run: async (client, interaction, message) => {

        // user without permission for dbPerms (wio.db)
        if (!dbPerms.has(interaction.user.id)) {
            await interaction.reply({
                content: `❌ Você não tem permissão para usar este comando.`,
                ephemeral: true
            });
            return;
        };

    const nome = interaction.options.getString('name')
    const discount = interaction.options.getNumber('discount')
    const days = interaction.options.getNumber('days')
    const max_uses = interaction.options.getNumber('max_uses')
    const amount = interaction.options.getNumber('amount')
    const role = interaction.options.getRole('role')
    const buy_amount_max = interaction.options.getNumber('buy_amount_max')
    const buy_amount = interaction.options.getNumber('buy_amount')

    if (discount > 100) return interaction.reply({ content: '🔔 O desconto não pode ser maior que 100%', ephemeral: true })
    if (discount < 0) return interaction.reply({ content: '🔔 O desconto não pode ser menor que 0%', ephemeral: true })
    if (days < 0) return interaction.reply({ content: '🔔 Os dias não podem ser menor que 0', ephemeral: true })
    if (max_uses < 0) return interaction.reply({ content: '🔔 O máximo de usos não pode ser menor que 0', ephemeral: true })
    if (amount < 0) return interaction.reply({ content: '🔔 A quantidade não pode ser menor que 0', ephemeral: true })
    if (buy_amount_max < 0) return interaction.reply({ content: '🔔 A quantidade de compra máxima não pode ser menor que 0', ephemeral: true })
    if (buy_amount < 0) return interaction.reply({ content: '🔔 A quantidade de compra não pode ser menor que 0', ephemeral: true })

    const dataAtual = new Date();
    const dataFinal = new Date(dataAtual);
    dataFinal.setDate(dataAtual.getDate() + days);

    const condicoes = {
      ...(buy_amount_max !== null && { qtdmaxima: buy_amount_max }),
      ...(buy_amount !== null && { precominimo: buy_amount }),
      ...(role?.id !== undefined && { cargospodeusar: role.id })
    };
    const cupomNovo = {
      usos: 0,
      desconto: discount,
      Nome: nome,
      ...(days !== null && {
        diasvalidos: dataFinal.getTime(),
        diasvalidos2: days
      }),
      criado: Date.now(),
      maxuse: max_uses,
      qtdcupom: amount,
      ...(Object.keys(condicoes).length > 0 && { condicoes })

    }

    function removePropriedadesNulas(obj) {
      const newObj = {};
      for (const prop in obj) {
        if (obj[prop] !== null) {
          newObj[prop] = obj[prop];
        }
      }
      return newObj;
    }

    const cupomSemNulos = removePropriedadesNulas(cupomNovo);



    const dd = produtos.fetchAll()
    const clientesComCupom = [];
    const clientesSemCupom = [];

    dd.forEach(cliente => {
      const cupomExistente = cliente.data.Cupom.find(cupom => cupom.Nome === cupomSemNulos.Nome);

      if (!cupomExistente) {
        cliente.data.Cupom.push(cupomSemNulos);
        clientesComCupom.push(cliente.ID);
      } else {
        clientesSemCupom.push(cliente.ID);
      }
    });

    dd.forEach(cliente => {
      produtos.set(`${cliente.ID}.Cupom`, cliente.data.Cupom);
    });

    interaction.reply({
      content: ` O **cupom** foi criado com sucesso em ${clientesComCupom.length} produtos e __possivelmente__ falhou nos produtos abaixo:\n\n\`${clientesSemCupom.slice(0, 10).join('\n')}${clientesSemCupom.length > 10 ? `\n... e mais ${clientesSemCupom.length - 10} produtos` : ''}\``,
      ephemeral: true
    });



  }
}
