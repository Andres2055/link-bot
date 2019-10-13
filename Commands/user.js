const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

const all = require('./utils/allUNeed.js')

module.exports = async (client, message, args) => {
	args.push('-')
	query = args.slice(0, -1).join("-")

	api.findUsers(query)
		.then(function(value) {
			guy = value['data']['users'][0]

			if (guy === undefined) {
				message.channel.send(`Nope <@${message.author.id}>, esta persona no existe`);
				return;
			};

			response = `**Datos de ${guy['displayName']}:** http://www.scpper.com/user/${guy['id']}`
			message.channel.send(response);
		}).catch(err => {
			console.log("Hubo un error de tipo: " + err);
			message.channel.send("Σ(°△°|||)  hay problema consultado a Scpper, inténtalo luego");
		});
}

module.exports.config = {
	name: "user",
	aliases: ["autor"],
	activo : true,
	configurable: true,
	grupo: "GENERAL",
	mensaje_espera : true
}