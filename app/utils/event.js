const { logFlowChange } = require('../chatbot_api');

async function formatInput(context) {
	const res = {};

	if (context.event.isPostback) {
		res.type = 'postback'; res.payload = context.event.postback.payload; res.title = context.event.postback.title;
		await logFlowChange(context.session.user.id, context.state.chatbotData.user_id, res.payload, res.title);
	} else if (context.event.isQuickReply) {
		res.type = 'quickreply'; res.payload = context.event.quickReply.payload; res.title = context.event.quickReply.payload;
		await logFlowChange(context.session.user.id, context.state.chatbotData.user_id, res.payload, res.title);
	} else if (context.event.isText) {
		res.type = 'text'; res.payload = context.event.message.text;
	}

	await context.setState({ input: res || {} });
	return res;
}

async function handleModule(context) {
	if (!context.state.module) {
		switch (context.state.input.type) {
		case 'postback':
		case 'quickreply':
			await context.setState({ dialog: context.state.input.payload });
			break;
		case 'text':
			await context.setState({ dialog: 'freeText', whatWasTyped: context.state.input.payload });
			break;
		default:
			break;
		}
	}
}

module.exports = { formatInput, handleModule };
