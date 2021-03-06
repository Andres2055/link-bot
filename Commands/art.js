'use strict';
const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js');

module.exports = async (client, message, args) => {
	let site = args.pop()

	if (!all.checkBranch(site)) {
		args.push(site); site = 'es'
	}

	args.push('-')
	let query = args.slice(0, -1).join("-")
	let tale = api.findPages(query, { site: site })

	tale.then(function (value) {
		let page = value['data']['pages'][0]

		if (page === undefined) {
			return message.channel.send('<@' + message.author.id + '>, ese artículo no es válido');
		};

		let embed = new Discord.MessageEmbed()
			.setTitle(page['title'] + ' (' + all.checkVotes(page['rating']) + ')')
			.setURL(page['site'] + '\/' + page['name'])
			.setDescription(all.checkAuthors(page['status'], page['authors'], page) + " [-" + site.toUpperCase() + "]")
			.setAuthor(message.author.username, message.author.displayAvatarURL)
			.setColor(all.checkSiteColor(site))

		message.channel.send({ embed });
	}).catch(err => {
		console.log("Hubo un error de tipo: " + err);
		message.channel.send("Σ(°△°|||)  hay problema consultado a Scpper, inténtalo luego");
	});
}

module.exports.config = {
	name: "art",
	aliases: ["r", "tale"],
	activo: true,
	configurable: true,
	grupo: "SCP",
	contador: 0
}