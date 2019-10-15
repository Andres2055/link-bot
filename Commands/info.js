const Discord = require("discord.js");
const config = require("../Storage/config.json");
const all = require('./utils/allUNeed.js')

const ver = config["VERSION"];
const verString = `${ver["major"]}.${ver["minor"]}.${ver["micro"]} ${ver["build"]}`;

module.exports = async (client, message, args) => {
	const embed = new Discord.RichEmbed()
		.setURL('https://github.com/Andres2055/link-bot')
		.setDescription("Y-yo, soy... Estiben. Dios, mi nombre sigue siendo tan horrendo, incluso creo que está mal escrito, que vergüenza. Yo, iba a decir que soy un robot y todo eso, probablemente una persona encerrada en una pieza de software ejecutable. Dios, que delirios. Aunque ahora tengo esteroides y puedo hacer más cosas, así que puedes llamarme _Gran hermano_ o Nii-san si lo prefieres :trukazo:")
		.setAuthor(`${client.user.username} (ver ${verString})`, client.user.displayAvatarURL)
		.setThumbnail(client.user.displayAvatarURL)
		.addField('Gustos', "Cuervos, patas, muros ~~y sacar gente~~", true)
		.addField('Hobbys', "Buscar enlaces, escribir, ayudar al staff y ser tu esclavo", true)
		.setColor(all.checkSiteColor("es"));

	message.channel.send({ embed });
}

module.exports.config = {
	name: "info",
	aliases: ["inf", "estiben"],
	activo : true,
	configurable: true,
	grupo: "GENERAL"
}