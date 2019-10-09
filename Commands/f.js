const Discord = require("discord.js");

module.exports = async (client, message, args) => {
	if (args[0] != undefined) {
		msg = ''
		for (var i = 0; i < args.length; i++) { msg += args[i] + ' '}
		message.channel.send(`**${message.author.username}** ha pagado sus respetos a **${msg}**`)
	} else {
		message.channel.send(`**${message.author.username}** ha pagado sus respetos`)
	} 
}

module.exports.config = {
	name: "f",
	aliases: ["pay"],
	activo : true,
	configurable: true,
	grupo: "GENERAL"
}