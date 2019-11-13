require('dotenv').config();

const { MessengerBot, FileSessionStore, withTyping } = require('bottender');
const { createServer } = require('bottender/restify');
const handler = require('./handler');
const requests = require('./requests');

const config = require('./bottender.config.js').messenger;
const { getPoliticianData } = require('./chatbot_api');

const mapPageToAccessToken = async (pageId) => {
	const perfilData = await getPoliticianData(pageId);
	return perfilData.fb_access_token;
};

const bot = new MessengerBot({
	mapPageToAccessToken,
	// accessToken: config.accessToken,
	appSecret: config.appSecret,
	verifyToken: config.verifyToken,
	sessionStore: new FileSessionStore(),
});

bot.setInitialState({});

const messageWaiting = eval(process.env.WITH_TYPING); // eslint-disable-line no-eval
if (messageWaiting) { bot.use(withTyping({ delay: messageWaiting })); }

bot.onEvent(handler);

const server = createServer(bot, { verifyToken: config.verifyToken });

server.post('/add-label', async (req, res) => {
	await requests.addLabel(req, res);
});

server.get('/name-id', async (req, res) => {
	await requests.getNameFBID(req, res);
});

server.listen(process.env.API_PORT, () => {
	console.log(`Server is running on ${process.env.API_PORT} port...`);
	console.log(`App: ${process.env.APP} & Page: ${process.env.PAGE}`);
	console.log(`MA User: ${process.env.MA_USER}`);
});
