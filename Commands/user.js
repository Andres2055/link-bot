const Discord = require("discord.js");
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js')

module.exports.run = async (client, message, args) => {
	args.shift().toLowerCase();
	args.push('-')
	query = args.slice(0, -1).join("-")
	const user = api.findUsers(query)

	user.then(function(value) {
		boi = value['data']['users'][0]

		if (boi === undefined) {
			return message.channel.send('<@' + message.author.id + '>, el usuario no existe');
		};
		response = '**Datos de ' + boi['displayName'] + ':** ' + 'http://www.scpper.com/user/' + boi['id']
		message.channel.send(response);
	}).catch(err => message.channel.send("Hubo un error de tipo: " + err));
}

module.exports.help = {
	name: "user"
}
