'use strict';
const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });
const all = require('./utils/allUNeed.js')

module.exports = async (client, message, args) => {
	let site;
	if (args.length === 1) {
		site = args[0]
	} else {
		site = "es"
	};

	let scpr = api.findTag('scp', {
		site: site,
		random: true
	})

	scpr.then(function(value) {
		let page = value['data']['pages'][0]

		const embed = new Discord.RichEmbed()
			.setTitle(`${page['title']} - ${all.checkTitle(page['title'], page['altTitle'])} (${all.checkVotes(page['rating'])})`)
			.setURL(`${page['site']}/${page['name']}`)
			.setDescription(`${all.checkAuthors(page['status'], page['authors'], page)} [-${site.toUpperCase()}]`)
			.setAuthor(message.author.username, message.author.displayAvatarURL)
			.setColor(all.checkSiteColor(site))

		message.channel.send({ embed });
	}).catch(err => {
		console.log("Hubo un error de tipo: " + err);
		message.channel.send("Σ(°△°|||)  hay problema consultado a Scpper, inténtalo luego");
	});
}

module.exports.config = {
	name: "scpr",
	aliases: [],
	activo : true,
	configurable: true,
	grupo: "SCP",
	contador : 0
}