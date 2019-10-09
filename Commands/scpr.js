const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js')

module.exports.run = async (client, message, args) => {
	if (args.length === 1) {
		site = args[0]
	} else {
		site = "es"
	};

	scpr = api.findTag('scp', {
		site: site,
		random: true
	})

	scpr.then(function(value) {
		page = value['data']['pages'][0]

		const embed = new Discord.RichEmbed()
			.setTitle(`${page['title']} - ${all.checkTitle(page['title'], page['altTitle'])} (${all.checkVotes(page['rating'])})`)
			.setURL(`${page['site']}/${page['name']}`)
			.setDescription(`${all.checkAuthors(page['status'], page['authors'])} [-${site.toUpperCase()}]`)
			.setAuthor(message.author.username, message.author.displayAvatarURL)
			.setColor(all.checkSiteColor(site))

		message.channel.send({ embed });
	}).catch(err => console.log("Hubo un error de tipo: " + err));
}

module.exports.config = {
	name: "scpr",
	aliases: [],
	activo : true,
	configurable: true,
	grupo: "GENERAL"
}