const flow = require('./flow');
const help = require('./helper');
const attach = require('./attach');

async function sendMainMenu(context, text) {
	const textToSend = text || await help.getRandomArray(flow.mainMenu.text1);
	await context.typing(1000 * 6);
	await context.sendText(textToSend);
}

async function sendGreetings(context) {
	await context.sendImage(flow.avatarImage);
	await attach.sendMsgFromAssistente(context, 'greetings', [flow.greetings.text1]);
	// await dialogs.sendMainMenu(context, flow.greetings.text2);
}

module.exports = {
	sendMainMenu, sendGreetings,
};
