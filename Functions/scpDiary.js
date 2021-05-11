'use strict'
const Discord = require('discord.js');
const Scpper = require("scpper.js");
const all = require('../Commands/utils/allUNeed.js');
const api = new Scpper.Scpper({ site: 'es' });

var getChannel = (client) => {
	try {
		//console.log(client.guilds);
		const guild = client.guilds.find(guild => guild.name === client.config.get("SERVER").NAME);
		/*guild.fetchBans().then(bans => {
            bans.forEach(user => {
				console.log(user)
                console.log(user.username + '#' + user.tag);
            });
        });*/
		const channel = guild['channels'].find(ch => ch.id === client.config.get("SERVER").CHANNEL_DIARY);
		return channel;
	} catch (err) {
		console.log('Aún no se ha logeado');
	}
}

module.exports.postSCPDiary = client => {
	const date = new Date();
	let options_date = { timeZone: client.config.get("SERVER").TIME_ZONE, year: 'numeric', month: 'numeric', day: 'numeric' };
	let options_time = { timeZone: client.config.get("SERVER").TIME_ZONE, hour12: false, hour: "2-digit", minute: "2-digit" };
	let dateString = date.toLocaleTimeString(client.config.get("SERVER").LOCALE, options_time);
	//getChannel(client);
	if (dateString == client.config.get("SERVER").HOUR_DIARY) {
		const channel = getChannel(client);
		channel.send('**Estas son las recomendaciones del día:**');

		let scpDiary = api.findTag('scp', { random: true });
		let scpESDiary = api.findTag(['+scp', '+es'], { random: true });
		let taleDiary = api.findTag('relato', { random: true });
		let taleESDiary = api.findTag(['+relato', '+es'], { random: true });

		scpDiary.then(function (value) {
			let page = value['data']['pages'][0];

			const embed = new Discord.MessageEmbed()
				.setTitle(`${page['title']} - ${all.checkTitle(page['title'], page['altTitle'])} (${all.checkVotes(page['rating'])})`)
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors'], page))
				.setAuthor('SCP del Día')
				.setColor(0x588d9b);

			channel.send({ embed });
		}).catch(err => {
			console.log('scpDiary' + err.stack),
			channel.send("Σ(°△°|||)  hay problema consultado a Scpper")
		});

		scpESDiary.then(function (value) {
			let page = value['data']['pages'][0];

			const embed = new Discord.MessageEmbed()
				.setTitle(`${page['title']} - ${all.checkTitle(page['title'], page['altTitle'])} (${all.checkVotes(page['rating'])})`)
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors'], page))
				.setAuthor('SCP-ES del Día')
				.setColor(0x588d9b);

			channel.send({ embed });
		}).catch(err => {
			console.log('scpESDiary' + err),
			channel.send("Σ(°△°|||)  hay problema consultado a Scpper")
		});

		taleDiary.then(function (value) {
			let page = value['data']['pages'][0];

			const embed = new Discord.MessageEmbed()
				.setTitle(all.checkTitle(page['title'], page['altTitle']) + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors'], page))
				.setAuthor('Relato del Día')
				.setColor(0x588d9b);

			channel.send({ embed });
		}).catch(err => {
			console.log('taleDiary' + err),
			channel.send("Σ(°△°|||)  hay problema consultado a Scpper")
		});

		taleESDiary.then(function (value) {
			let page = value['data']['pages'][0];

			const embed = new Discord.MessageEmbed()
				.setTitle(all.checkTitle(page['title'], page['altTitle']) + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors'], page))
				.setAuthor('Relato-ES del Día')
				.setColor(0x588d9b);

			channel.send({ embed });
		}).catch(err => {
			console.log('taleESDiary' + err),
			channel.send("Σ(°△°|||)  hay problema consultado a Scpper")
		});
	} else {
		//console.log('Aún no es hora');
	};
};
