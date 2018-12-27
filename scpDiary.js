const Discord = require('discord.js');
const Scpper = require("scpper.js");
const all = require('./Commands/utils/allUNeed.js');

const api = new Scpper.Scpper({site: 'es'});
const date = new Date();

var getChannel = (client) => {
	try {
		const guild = client.guilds.find(guild => guild.id === '193819598565408769');
		const channel = guild['channels'].find(ch => ch.id === '459517125946769408');
		return channel;
	} catch(err) {
		console.log('Aún no se ha logeado');
	}
}

module.exports.postSCPDiary = client => {
	const channel = getChannel(client);
	console.log(date.getUTCHours())
	if(date.getUTCHours() == 1) {
		channel.send('**Estas son las recomendaciones del día:**');

		scpDiary = api.findTag('scp', { random: true });
		scpESDiary = api.findTag(['+scp', '+es'], { random:true });
		taleDiary = api.findTag('relato', { random:true });
		taleESDiary = api.findTag(['+relato', '+es'], { random:true });

		scpDiary.then(function(value) {
			page = value['data']['pages'][0];

			const embed = new Discord.RichEmbed()
				.setTitle(all.checkTitle(page['title'], page['altTitle']) + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors']))
				.setAuthor('SCP del Día')
				.setColor(0x588d9b);

			channel.send({ embed });
		})
		.catch(err => console.log('scpDiary' + err));

		scpESDiary.then(function(value) {
			page = value['data']['pages'][0];
						console.log(page)


			const embed = new Discord.RichEmbed()
				.setTitle(all.checkTitle(page['title'], page['altTitle']) + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors']))
				.setAuthor('SCP-ES del Día')
				.setColor(0x588d9b);

			channel.send({ embed });
		})
		.catch(err => console.log('scpESDiary' + err));

		taleDiary.then(function(value) {
			page = value['data']['pages'][0];

			const embed = new Discord.RichEmbed()
				.setTitle(all.checkTitle(page['title'], page['altTitle']) + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors']))
				.setAuthor('Relato del Día')
				.setColor(0x588d9b);

			channel.send({ embed });
		})
		.catch(err => console.log('taleDiary' + err));

		taleESDiary.then(function(value) {
			page = value['data']['pages'][0];

			const embed = new Discord.RichEmbed()
				.setTitle(all.checkTitle(page['title'], page['altTitle']) + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors']))
				.setAuthor('Relato-ES del Día')
				.setColor(0x588d9b);

			channel.send({ embed });
		})
		.catch(err => console.log('taleESDiary' + err));
	} else {
		console.log('Aún no es hora');
	};
};
