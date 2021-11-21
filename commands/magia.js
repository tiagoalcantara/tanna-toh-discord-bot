const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const baseUrl = 'http://tormentaappapi-env.eba-byb7eexi.us-east-1.elasticbeanstalk.com/magias';

const fetchData = async (params) => {
	const response = await axios.get(baseUrl, {
		params: {
			size: '15',
			...params,
		},
	});

	return response.data;
};

const sendEmbedList = (content, currentPage, totalPages, totalElements, channel) => {
	const fields = [];

	content.forEach(spell => {
		fields.push(
			{ name: spell.titulo, value: `${spell.categoria} ${spell.nivel} (${spell.escola})` },
		);
	});

	const embedList = new MessageEmbed()
		.setColor('#71080C')
		.addFields(...fields)
		.setTimestamp()
		.setFooter(`Página ${currentPage + 1} de ${totalPages}`);

	channel.send({ embeds: [embedList] });
};

const sendEmbedDetails = (spell, channel) => {
	const fields = [];

	const fieldsConfig = [
		{
			key: 'categoria',
			title: 'Categoria',
			inline: true,
		},
		{
			key: 'nivel',
			title: 'Nível',
			inline: true,
		},
		{
			key: 'escola',
			title: 'Escola',
			inline: true,
		},
		{
			key: 'execucao',
			title: 'Execução',
			inline: true,
		},
		{
			key: 'alcance',
			title: 'Alcance',
			inline: true,
		},
		{
			key: 'alvo',
			title: 'Alvo',
			inline: true,
		},
		{
			key: 'duracao',
			title: 'Duração',
			inline: true,
		},
		{
			key: 'resistencia',
			title: 'Resistência',
			inline: true,
		},
		{
			key: 'area',
			title: 'Área',
			inline: true,
		},
		{
			key: 'alvoOuArea',
			title: 'Alvo ou Área',
			inline: true,
		},
		{
			key: 'alvos',
			title: 'Alvos',
			inline: true,
		},
		{
			key: 'efeito',
			title: 'Efeito',
			inline: true,
		},
		{
			key: 'descricao',
			title: 'Descrição',
			inline: false,
		},
		{
			key: 'aprimoramentos',
			title: 'Aprimoramentos',
			inline: false,
		},
	];

	fieldsConfig.forEach(fieldConfig => {
		const fieldValue = spell[fieldConfig.key];
		if(fieldValue) {
			fields.push(
				{ name: fieldConfig.title, value: `${fieldValue}`, inline: fieldConfig.inline },
			);
		}
	});

	const embedList = new MessageEmbed()
		.setTitle(spell.titulo)
		.setColor('#71080C')
		.addFields(...fields)
		.setThumbnail('https://static.wikia.nocookie.net/tormenta/images/b/ba/S%C3%ADmbolo_de_Tanna-Toh.jpg/revision/latest/scale-to-width-down/309?cb=20150516043836&path-prefix=pt')
		.setTimestamp();

	channel.send({ embeds: [embedList] });
};

module.exports = {
	name: 'magia',
	description: 'Busca detalhes ou uma lista de magias.',
	options: [
		{
			name: 'titulo',
			type: 3,
			description: 'Título da magia',
			required: false,
		},
		{
			name: 'pagina',
			type: 3,
			description: 'Página caso a lista seja muito grande',
			required: false,
		},
		{
			name: 'nivel',
			type: 3,
			description: 'Níveis separados por vírgula',
			required: false,
		},
		{
			name: 'categoria',
			type: 3,
			description: 'Categoria da magia',
			required: false,
			choices: [
				{
					name: 'Arcana',
					value: 'arcana',
				},
				{
					name: 'Divina',
					value: 'divina',
				},
				{
					name: 'Universal',
					value: 'universal',
				},
			],
		},
	],
	async execute(interaction) {
		const params = {
			titulo: interaction.options.getString('titulo') || '',
			page: '' + parseInt(interaction.options.getString('pagina') - 1) || '0',
			categoria: interaction.options.getString('categoria') || '',
			nivel: interaction.options.getString('nivel')?.replace('.', ',') || '1,2,3,4,5',
		};

		const { content, totalPages, totalElements, empty, pageable: { pageNumber } } = await fetchData(params);

		if(empty) {
			await interaction.reply('😥 Nenhuma magia encontrada ');
		} else if(totalElements > 1) {
			await interaction.reply(`📚 Encontrei ${totalElements} magias!`);
			sendEmbedList(content, pageNumber, totalPages, totalElements, interaction.channel);
		} else {
			sendEmbedDetails(content[0], interaction.channel);
			await interaction.reply('📜');
		}
	},
};