const { GatewayIntentBits, Client, Collection, ChannelType, Partials } = require("discord.js")
const { AtivarIntents } = require("./Functions/StartIntents");
const express = require("express");
const app = express();
const client = new Client({
    intents: Object.keys(GatewayIntentBits),
    partials: Object.keys(Partials)
});

const {port} = require("./config.json");

const estatisticasStormInstance = require("./Functions/VariaveisEstatisticas");
const EstatisticasStorm = new estatisticasStormInstance();
module.exports = { EstatisticasStorm }

AtivarIntents();

const config = require("./config.json");
const events = require('./Handler/events')
const slash = require('./Handler/slash');


slash.run(client);
events.run(client);

client.slashCommands = new Collection();



process.on('unhandRejection', (reason, promise) => {
    console.log(`🚫 Erro Detectado:\n\n` + reason, promise)
});
process.on('uncaughtException', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});
process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
}); 


const login = require("./routes/login");
app.use("/", login);

const callback = require("./routes/callback");
app.use("/", callback);

try {
  app.listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : port
  });
} finally {
  console.log("HTTP Process Runnig");
}

client.login(config.token);

