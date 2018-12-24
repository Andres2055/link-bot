const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js')

module.exports.run = async (client, message, args) => {
	args.shift().toLowerCase();
	if (args.length === 2) {
		site = args[0]		
		query = args[1]
	} else {
		site = "es"
		query = args[0]
	}

	console.log(query)
	console.log(site)

	const scp = api.findPages('scp-' + query, { site: site })

	scp.then(function(value) {
		page = value['data']['pages'][0]
		console.log(page)

		if (page === undefined) {
			return message.channel.send(`<@${message.author.id}>, el SCP en cuestión no existe`);
		} 

		const embed = new Discord.RichEmbed()
			.setTitle(all.checkTitle(page['title'], page['altTitle']) + 
					' (' + all.checkVotes(page['rating']) + ')')
			.setURL(page['site'] + '\/' + page['name'])
			.setDescription(all.checkAuthors(page['status'], page['authors']) + 
							" [-" + site.toUpperCase() + "]")
			.setAuthor(message.author.username, message.author.displayAvatarURL)
			.setColor(0x588d9b)

		message.channel.send({ embed });
	}).catch(err => message.channel.send("Hubo un error de tipo: " + err));
}

module.exports.help = {
	name: "scp"
}
