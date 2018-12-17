const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js')

module.exports.run = async (client, message, args) => {
	args.shift().toLowerCase();
	site = args.pop()

	if (all.checkBranch(site)) {} 
	else {args.push(site); site = 'es'}

	query = args
	console.log(query)

	const tag = api.findTag(query, {
		site: site,
		limit: 5,
		random: true
	})

	tag.then(function(value) {
		page = value['data']['pages']
		list = ""

		if (page[0] === undefined) {
			return message.channel.send('<@' + message.author.id + '>, no se encontraron artículos con la etiqueta buscada');
		};

		for (var i = 0; i < page.length; i++) {
			queue = page[i]

			response = '**' + all.checkTitle(queue['title'], queue['altTitle']) + ':** ' +
				queue['site'] + '\\' + queue['name'] + ' (' +
				all.checkVotes(queue['rating']) + ')\n'

			list += response
		}

		const embed = new Discord.RichEmbed()
			.setTitle('Artículos con las etiquetas: ' + args + " (-" + site.toUpperCase() + ")")
			.setDescription(list)
			.setAuthor(message.author.username, message.author.displayAvatarURL)
			.setColor(0x588d9b)

		message.channel.send({ embed });
	});
}

module.exports.help = {
	name: "tag"
}
