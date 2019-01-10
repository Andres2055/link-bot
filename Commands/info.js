const Discord = require("discord.js");
const config = require("../Storage/config.json");

const ver = config["VERSION"];
const verString = `${ver["major"]}.${ver["minor"]}.${ver["micro"]} ${ver["build"]}`;

module.exports.run = async (client, message, args) => {
	const embed = new Discord.RichEmbed()
		.setURL('https://github.com/Andres2055/link-bot')
		.setDescription("¡Hola! Soy Estiben, probablemente alguna proyección de algún sujeto en un universo paralelo o algo.")
		.setAuthor(`${client.user.username} (ver ${verString})`, client.user.displayAvatarURL)
		.setThumbnail(client.user.displayAvatarURL)
		.addField('Gustos', "Cuervos y Consomé Panchi", true)
		.addField('Hobbys', "Buscar enlaces, escribir y ser tu esclavo", true)
		.setColor(all.checkSiteColor("es"));

	message.channel.send({ embed });
}

module.exports.help = {
	name: "info",
	aliases: ["inf"]
}