const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js')

module.exports = async (client, message, args) => {
	rran = api.findTag('relato', { random: true })

	rran.then(function(value) {
		page = value['data']['pages'][0]

		const embed = new Discord.RichEmbed()
			.setTitle(page['title'] + ' (' + all.checkVotes(page['rating']) + ')')
			.setURL(page['site'] + '\/' + page['name'])
			.setDescription(all.checkAuthors(page['status'], page['authors']))
			.setAuthor(message.author.username, message.author.displayAvatarURL)
			.setColor(all.checkSiteColor("es"))

		message.channel.send({ embed });
	}).catch(err => {
		console.log("Hubo un error de tipo: " + err);
		message.channel.send("Σ(°△°|||)  hay problema consultado a Scpper, inténtalo luego");
	});
}

module.exports.config = {
	name: "artr",
	aliases: ["rr", "random_tale"],
	activo : true,
	configurable: true,
	grupo: "SCP",
	contador : 0
}