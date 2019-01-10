const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js')

module.exports.run = async (client, message, args) => {
	args.push('-')
	query = args.slice(0, -1).join("-")

	const user = api.findUsers(query)
		.then(function(value) {
			guy = value['data']['users'][0]

			if (guy === undefined) {
				message.channel.send(`<@${message.author.id}>, el usuario no existe`);
				return;
			};

			response = `**Datos de ${guy['displayName']}:** http://www.scpper.com/user/${guy['id']}`
			message.channel.send(response);
		}).catch(err => message.channel.send("Hubo un error de tipo: " + err));
}

module.exports.help = {
	name: "user",
	aliases: ["autor"]
}