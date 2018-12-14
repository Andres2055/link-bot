const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
	const embed = new Discord.RichEmbed()
		.setURL('https://github.com/Andres2055/link-bot')
		.setDescription("¡Hola! Soy Estiben, probablemente alguna proyección de algún sujeto en un universo paralelo o algo.")
		.setAuthor("Estiben (ver 0.3)", client.user.displayAvatarURL)
		.setThumbnail("https://media.discordapp.net/attachments/520481910397468685/521122008369594405/Ball3.jpg")
		.addField('Gustos', "Cuervos y Consomé Panchi", true)
		.addField('Hobbys', "Buscar enlaces, escribir y ser tu esclavo", true)
		.setColor(0x588d9b)

	message.channel.send({ embed });
}

module.exports.help = {
	name: "info"
}