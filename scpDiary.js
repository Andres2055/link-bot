const Discord = require('discord.js');
const Scpper = require("scpper.js");
const all = require('./Commands/utils/allUNeed.js');
const config = require("./Storage/config.json").SERVER;

const api = new Scpper.Scpper({ site: 'es' });

var getChannel = (client) => {
	try {
		//console.log(client.guilds);
		const guild = client.guilds.find(guild => guild.name === config.NAME);
		/*guild.fetchBans().then(bans => {
            bans.forEach(user => {
				console.log(user)
                console.log(user.username + '#' + user.tag);
            });
        });*/
		const channel = guild['channels'].find(ch => ch.name === config.CHANNEL_DIARY);
		return channel;
	} catch (err) {
		console.log('Aún no se ha logeado');
	}
}

module.exports.postSCPDiary = client => {
	const date = new Date();
	options_date = { timeZone: config.TIME_ZONE, year: 'numeric', month: 'numeric', day: 'numeric' };
	options_time = { timeZone: config.TIME_ZONE, hour12: false, hour: "2-digit", minute: "2-digit" };
	dateString = date.toLocaleTimeString(config.LOCALE, options_time);
	//getChannel(client);
	if (dateString == config.HOUR_DIARY) {
		const channel = getChannel(client);
		channel.send('**Estas son las recomendaciones del día:**');

		scpDiary = api.findTag('scp', { random: true });
		scpESDiary = api.findTag(['+scp', '+es'], { random: true });
		taleDiary = api.findTag('relato', { random: true });
		taleESDiary = api.findTag(['+relato', '+es'], { random: true });

		scpDiary.then(function (value) {
			page = value['data']['pages'][0];

			const embed = new Discord.RichEmbed()
				.setTitle(all.checkTitle(page['title'], page['altTitle']) + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors']))
				.setAuthor('SCP del Día')
				.setColor(0x588d9b);

			channel.send({ embed });
		}).catch(err => {
			console.log('scpDiary' + err),
			channel.send("Σ(°△°|||)  hay problema consultado a Scpper")
		});

		scpESDiary.then(function (value) {
			page = value['data']['pages'][0];

			const embed = new Discord.RichEmbed()
				.setTitle(all.checkTitle(page['title'], page['altTitle']) + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors']))
				.setAuthor('SCP-ES del Día')
				.setColor(0x588d9b);

			channel.send({ embed });
		}).catch(err => {
			console.log('scpESDiary' + err),
			channel.send("Σ(°△°|||)  hay problema consultado a Scpper")
		});

		taleDiary.then(function (value) {
			page = value['data']['pages'][0];

			const embed = new Discord.RichEmbed()
				.setTitle(all.checkTitle(page['title'], page['altTitle']) + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors']))
				.setAuthor('Relato del Día')
				.setColor(0x588d9b);

			channel.send({ embed });
		}).catch(err => {
			console.log('taleDiary' + err),
			channel.send("Σ(°△°|||)  hay problema consultado a Scpper")
		});

		taleESDiary.then(function (value) {
			page = value['data']['pages'][0];

			const embed = new Discord.RichEmbed()
				.setTitle(all.checkTitle(page['title'], page['altTitle']) + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors']))
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
