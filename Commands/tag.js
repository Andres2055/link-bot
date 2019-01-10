const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js')

module.exports.run = async (client, message, args) => {
	site = args.pop();

	if (all.checkBranch(site)) {} 
	else {args.push(site); site = 'es'};

	var query = args;
	console.log(query);

	const tag = api.findTag(query, {
		site: site,
		limit: 5,
		random: true
	}).then(value => {
		page = value['data']['pages'];
		list = "";

		if (page[0] === undefined) {
			message.channel.send(`<@${message.author.id}>, no se encontraron artículos con la etiqueta buscada`);
			return;
		};

		for (var i = 0; i < page.length; i++) {
			queue = page[i]

			response = `**${all.checkTitle(queue['title'], queue['altTitle'])}:** \
						${queue['site']}\\${queue['name']} \
						(${all.checkVotes(queue['rating'])})\n`

			list += response
		}

		const embed = new Discord.RichEmbed()
			.setTitle(`Artículos con las etiquetas: ${args} (-${site.toUpperCase()})`)
			.setDescription(list)
			.setAuthor(message.author.username, message.author.displayAvatarURL)
			.setColor(all.checkSiteColor(site))

		message.channel.send({ embed });
	}).catch(err => message.channel.send("Hubo un error de tipo: " + err));
}

module.exports.help = {
	name: "tag",
	aliases: ["etiq"]
}