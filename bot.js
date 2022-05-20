require('dotenv').config()
const { Telegraf, Markup } = require("telegraf");
const axios = require('axios')
const { io } = require("socket.io-client");
const bot = new Telegraf(process.env.BOT_TOKEN);

// const socket = io("ws://192.168.4.18:3000",{ transports: ["websocket"], reconnection: false });

function socket_connect()
{
    console.log('func socket_connect');
    socket = io.connect('ws://192.168.4.18:3000');
}

function socket_reconnect()
{
    console.log('func socket_reconnect');
    socket.socket.reconnect();
}

function socket_disconnect ()
{
    console.log('func socket_disconnect');
    if (socket) socket.disconnect();
}

bot.command("start", async (ctx) => {
  return await ctx.reply(
    "Has iniciado el bot, pulsa una de las opciones",
    Markup.keyboard([
      ["Control", "Parar"],
      ["🌡️ Temperatura", "💧 Humedad" ], 
    ])
      .resize()
  );
});

bot.hears("Control", (ctx) => {
  socket_connect();
  ctx.reply("Cada 10 seg recibiras las mediciones");
  socket.on("sensor", (temp) => {
    ctx.reply(temp + "Cº 🌡️");
  });
  socket.on("sensor", (tem, hum) => {
    ctx.reply(hum + "% 💧");
  });
});

bot.hears("Parar", (ctx) => {
  ctx.reply("Parando las mediciones...");
  socket_disconnect();
})

bot.hears("🌡️ Temperatura", (ctx) => {
  socket_connect();
  ctx.reply("Midiendo la temperatura...");
  socket.on("sensor", (temp) => {
    ctx.reply(temp + "Cº 🌡️");
    socket_disconnect();
  });
});

bot.hears("💧 Humedad", (ctx) => {
  socket_connect();
  ctx.reply("Midiendo la humedad...");
  socket.on("sensor", (tem, hum) => {
    ctx.reply(hum + "% 💧");
    socket_disconnect();
  });
});

bot.launch();