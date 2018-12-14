const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js')

module.exports.run = async (client, message, args) => {
	args.shift().toLowerCase();
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
			.setTitle(page['altTitle'] + ' (' + all.checkVotes(page['rating']) + ')')
			.setURL(page['site'] + '\/' + page['name'])
			.setDescription(all.checkAuthors(page['status'], page['authors']) + " [-" + site.toUpperCase() + "]")
			.setAuthor(message.author.username, message.author.displayAvatarURL)
			.setColor(0x588d9b)

		message.channel.send({ embed });
	});
}

module.exports.help = {
	name: "scpr"
}