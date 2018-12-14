const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js')

module.exports.run = async (client, message, args) => {
	args.shift().toLowerCase();
	rran = api.findTag('relato', { random: true })

	rran.then(function(value) {
		page = value['data']['pages'][0]

		const embed = new Discord.RichEmbed()
			.setTitle(page['title'] + ' (' + all.checkVotes(page['rating']) + ')')
			.setURL(page['site'] + '\/' + page['name'])
			.setDescription(all.checkAuthors(page['status'], page['authors']))
			.setAuthor(message.author.username, message.author.displayAvatarURL)
			.setColor(0x588d9b)

		message.channel.send({ embed });
	});
}

module.exports.help = {
	name: "artr"
}