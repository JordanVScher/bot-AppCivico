const assistenteAPI = require('../chatbot_api');
const { createIssue } = require('./sendIssue');
const help = require('./helper');

async function sendAnswer(context) { // send answer from posicionamento
	await context.typingOn();
	await context.setState({ currentTheme: context.state.knowledge.knowledge_base[0] });

	if (context.state.currentTheme && ((context.state.currentTheme.answer && context.state.currentTheme.answer.length > 0)
		|| (context.state.currentTheme.saved_attachment_type !== null && context.state.currentTheme.saved_attachment_id !== null))) {
		try {
			await assistenteAPI.setIntentStatus(context.state.chatbotData.user_id, context.session.user.id, context.state.currentIntent, 1);
			await assistenteAPI.logAskedEntity(context.session.user.id, context.state.chatbotData.user_id, context.state.currentTheme.entities[0].id);

			await help.sendTextAnswer(context, context.state.currentTheme);
			await help.sendAttachment(context, context.state.currentTheme);
		} catch (error) {
			await help.Sentry.configureScope(async (scope) => { // sending to sentry
				scope.setUser({ username: `${context.session.user.first_name} ${context.session.user.last_name}` });
				scope.setExtra('state', context.state);
				throw error;
			});
		}
		await context.typingOff();
	} else {
		await createIssue(context);
	}
}

module.exports = { sendAnswer };
