const Discord = require("discord.js");

const version = {"major": 0, "minor": 4, "micro": 1, "build": "beta"}
const verString = ` ${version["major"]}.${version["minor"]}.${version["micro"]} ${version["build"]} `

module.exports.run = async (client, message, args) => {
	const embed = new Discord.RichEmbed()
		.setURL('https://github.com/Andres2055/link-bot')
		.setDescription("¡Hola! Soy Estiben, probablemente alguna proyección de algún sujeto en un universo paralelo o algo.")
		.setAuthor(`${client.user.username} (ver ${verString})`, client.user.displayAvatarURL)
		.setThumbnail(client.user.displayAvatarURL)
		.addField('Gustos', "Cuervos y Consomé Panchi", true)
		.addField('Hobbys', "Buscar enlaces, escribir y ser tu esclavo", true)
		.setColor(0x588d9b);

	message.channel.send({ embed });
}

module.exports.help = {
	name: "info",
	aliases: ["inf"]
}
