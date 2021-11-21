const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const readCommands = (client) => {
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

	commandFiles.forEach(file => {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	});
};

const deployCommands = (client) => {
	const commands = client.commands.map(({ execute, ...data }) => data);

	const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

	(async () => {
		try {
			console.log('Iniciando deploy dos comandos.');

			await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
				{ body: commands },
			);

			console.log('Finalizou deploy dos comandos com sucesso');
		} catch (error) {
			console.error(error);
		}
	})();
};

module.exports = { deployCommands, readCommands };