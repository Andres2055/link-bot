const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' })

const all = require('./utils/allUNeed.js')

module.exports.run = async (client, message, args) => {
	args.shift().toLowerCase();
	site = args.pop()

	if (all.checkBranch(site)) {}
	else {args.push(site); site = 'es'}

	args.push('-')
	query = args.slice(0, -1).join("-")
	const tale = api.findPages(query, { site: site })

	tale.then(function(value) {
		page = value['data']['pages'][0]

		if (page === undefined) {
			return message.channel.send('<@' + message.author.id + '>, introduzca un artículo válido');
		};

		const embed = new Discord.RichEmbed()
				.setTitle( page['title'] + ' (' + all.checkVotes(page['rating']) + ')')
				.setURL(page['site'] + '\/' + page['name'])
				.setDescription(all.checkAuthors(page['status'], page['authors']) + " [-" + site.toUpperCase() + "]")
				.setAuthor(message.author.username, message.author.displayAvatarURL)
				.setColor(0x588d9b) 

		message.channel.send({ embed });
	});	
}

module.exports.help = {
	name: "art"
}