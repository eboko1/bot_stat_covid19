
require('dotenv').config();
const Telegraf = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `
        Привіт ${ctx.message.from.first_name}!
        Цей  ЧАТ надає оновлені дані про випадки коронавірусу в режимі реального часу зі сторінки світових метрів та інших важливих веб-сайтів, що надаються найвідомішими організаціями та статистичними управліннями у світі. 
        Переглянути весь список країн можна командою /help.
    `,
    Markup.keyboard([
        ['Ukraine','Hungary'], 
        ['Slovakia', 'Moldova'],
        ['Poland','Belarus']
    ])
      .resize()
      .extra()
  )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
  let data = {};

  try {
    data = await api.getReportsByCountries(ctx.message.text);

    const formatData = 
    `Країна: ${data[0][0].country}
    Випадки: ${data[0][0].cases}
    Смертей: ${data[0][0].deaths}
    Вилікувались: ${data[0][0].recovered}
    ${data[0][0].flag}
    `
  ;
    ctx.reply(formatData);
  } catch {
    ctx.reply('Країни з такою назвою не має, перегляньте список країн /help.');
  }
});
bot.launch();

// eslint-disable-next-line no-console
console.log('Бот запущений');