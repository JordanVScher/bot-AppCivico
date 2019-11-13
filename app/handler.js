const assistenteAPI = require('./chatbot_api');
const { createIssue } = require('./utils/sendIssue');
const flow = require('./utils/flow');
const help = require('./utils/helper');
const dialogs = require('./utils/dialogs');

module.exports = async (context) => {
	try {
		await context.setState({ chatbotData: await assistenteAPI.getPoliticianData(context.event.rawEvent.recipient.id) });

		switch (context.state.dialog) {
		case 'createIssueDirect':
			await createIssue(context);
			await dialogs.sendMainMenu(context);
			break;
		case 'notificationOn':
			await assistenteAPI.updateBlacklistMA(context.session.user.id, 1);
			await assistenteAPI.logNotification(context.session.user.id, context.state.politicianData.user_id, 3);
			await context.sendText(flow.notifications.on);
			break;
		case 'notificationOff':
			await assistenteAPI.updateBlacklistMA(context.session.user.id, 0);
			await assistenteAPI.logNotification(context.session.user.id, context.state.politicianData.user_id, 4);
			await context.sendText(flow.notifications.off);
			break;
		}
	} catch (err) {
		await help.sentryError('Erro', err);
	}
};
