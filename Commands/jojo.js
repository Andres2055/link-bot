const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
	jojo = 1 + Math.floor(Math.random() * 100);
	console.log(jojo)
	if (jojo === 20) {
		message.channel.send(`¡<@${message.author.id}> es el **JoJos**!`);
	} else {
		message.channel.send(`<@${message.author.id}> no es el JoJos`);
	}
}

module.exports.help = {
	name: "jojo"
}