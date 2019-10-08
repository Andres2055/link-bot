const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' })

const all = require('./utils/allUNeed.js')

module.exports.run = async (client, message, args) => {
	site = args.pop()

	if (all.checkBranch(site)) {}
	else {args.push(site); site = 'es'}

	args.push('-')
	query = args.slice(0, -1).join("-")
	const tale = api.findPages(query, { site: site })

	tale.then(function(value) {
		page = value['data']['pages'][0]

		if (page === undefined) {
			return message.channel.send('<@' + message.author.id + '>, ese artículo no es válido');
		};

		const embed = new Discord.RichEmbed()
				.setTitle( page['title'] + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors']) + " [-" + site.toUpperCase() + "]")
				.setAuthor(message.author.username, message.author.displayAvatarURL)
				.setColor(all.checkSiteColor(site)) 

		message.channel.send({ embed });
	}).catch(err => console.log("Hubo un error de tipo: " + err));	
}

module.exports.config = {
	name: "art",
	aliases: ["r"],
	activo : false
}