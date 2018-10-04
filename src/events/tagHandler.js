const { Event, Stopwatch } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { event: 'commandUnknown' });
	}

	async run(message, command) {
		const tagCommand = this.client.commands.get('tag');
		const timer = new Stopwatch();

		if (this.client.options.typing) message.channel.startTyping();
		try {
			await this.client.inhibitors.run(message, tagCommand);
			try {
				const commandRun = tagCommand.show(message, [command]);
				timer.stop();
				const response = await commandRun;
				this.client.finalizers.run(message, tagCommand, response, timer);
				this.client.emit('commandSuccess', message, tagCommand, ['show', command], response);
			} catch (error) {
				this.client.emit('commandError', message, tagCommand, ['show', command], error);
			}
		} catch (response) {
			this.client.emit('commandInhibited', message, tagCommand, response);
		}
		if (this.client.options.typing) message.channel.stopTyping();
	}

};
