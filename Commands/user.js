'use strict';
const Scpper = require("scpper.js");
const api = new Scpper.Scpper({ site: 'es' });

module.exports = async (client, message, args) => {
	args.push('-');
	let query = args.slice(0, -1).join("-");

	api.findUsers(query)
		.then(function(value) {
			let guy = value['data']['users'][0]

			if (guy === undefined) {
				message.channel.send(`Nope <@${message.author.id}>, esta persona no existe`);
				return;
			};

			let response = `**Datos de ${guy['displayName']}:** http://www.scpper.com/user/${guy['id']}`
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
	grupo: "SCP",
	contador : 0
}