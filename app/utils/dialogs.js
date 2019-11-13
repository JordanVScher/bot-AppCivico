const flow = require('./flow');
const help = require('./helper');

async function sendMainMenu(context, text) {
	const textToSend = text || help.getRandomArray(flow.mainMenu.text1);
	await context.typing(1000 * 6);
	await context.sendText(textToSend);
}

module.exports = {
	sendMainMenu,
};
