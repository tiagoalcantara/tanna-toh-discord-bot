require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const { deployCommands, readCommands } = require('./deploy-commands');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

client.once('ready', async () => {
	console.log('Conectado!');
	readCommands(client);
	deployCommands(client);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	try {
		await client.commands.get(interaction.commandName).execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Não foi possível executar o comando', ephemeral: true });
	}
});

client.login(process.env.BOT_TOKEN);