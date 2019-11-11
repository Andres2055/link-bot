const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js')

module.exports = async (client, message, args) => {
	//console.log(args)
	if (args.length === 2) {
		site = args[0]
		query = args[1]
	} else {
		site = "es"
		query = args[0]
	}

	scpToSearch = `scp-${query}`
	if (query == "4000") { scpToSearch = "taboo"; }

	const scp = api.findPages(scpToSearch, { site: site })
		.then(value => {
			page = value['data']['pages'][0]

			if (page === undefined) {
				return message.channel.send(`Ese SCP no existe, <@${message.author.id}>.`);
			}

			const embed = new Discord.RichEmbed()
				.setTitle(`${page['title']} - ${all.checkTitle(page['title'], page['altTitle'])} (${all.checkVotes(page['rating'])})`)
				.setURL(`${page['site']}/${page['name']}`)
				.setDescription(`${all.checkAuthors(page['status'], page['authors'])} [-${site.toUpperCase()}]`)
				.setAuthor(message.author.username, message.author.displayAvatarURL)
				.setColor(all.checkSiteColor(site));

			if (page["name"] == "taboo") {
				embed.setTitle(`SCP-4000 - Tabú (${all.checkVotes(page['rating'])})`)
			}

			message.channel.send({ embed });
		}).catch(err => {
			console.log("Hubo un error de tipo: " + err);
			message.channel.send("Σ(°△°|||)  hay problema consultado a Scpper, inténtalo luego");
		});
}

module.exports.config = {
	name: "scp",
	aliases: [],
	activo: true,
	configurable: true,
	grupo: "SCP",
	contador : 0
}