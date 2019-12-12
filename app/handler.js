const assistenteAPI = require('./chatbot_api');
const event = require('./utils/event');
const { createIssue } = require('./utils/sendIssue');
const flow = require('./utils/flow');
const help = require('./utils/helper');
const dialogs = require('./utils/dialogs');
const DF = require('./utils/dialogFlow');

module.exports = async (context) => {
	try {
		await context.setState({ chatbotData: await assistenteAPI.getChatbotData(context.event.rawEvent.recipient.id) });
		await assistenteAPI.postRecipient(context.state.chatbotData.user_id, await help.buildRecipientObj(context));
		await event.formatInput(context);
		await event.handleModule(context);

		switch (context.state.dialog) {
		case 'greetings':
			await dialogs.sendGreetings(context);
			break;
		case 'createIssueDirect':
			await createIssue(context);
			await dialogs.sendMainMenu(context);
			break;
		case 'freeText':
			await DF.dialogFlow(context);
			break;
		case 'notificationOn':
			await assistenteAPI.updateBlacklistMA(context.session.user.id, 1);
			await assistenteAPI.logNotification(context.session.user.id, context.state.chatbotData.user_id, 3);
			await context.sendText(flow.notifications.on);
			await dialogs.sendMainMenu(context);
			break;
		case 'notificationOff':
			await assistenteAPI.updateBlacklistMA(context.session.user.id, 0);
			await assistenteAPI.logNotification(context.session.user.id, context.state.chatbotData.user_id, 4);
			await context.sendText(flow.notifications.off);
			await dialogs.sendMainMenu(context);
			break;
		}
	} catch (err) {
		await help.sentryError('Erro', err);
	}
};
