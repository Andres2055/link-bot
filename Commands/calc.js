const Discord = require("discord.js");
const math = require("mathjs"); // librería para cálculo simbólico

module.exports.run = async (client, message, args) => {
	var expresion = args.join(" ");
	try {	
		console.log(typeof expresion + " " + expresion);
		result = math.evaluate(expresion);
		const embed = new Discord.RichEmbed()
			.setTitle(`Resultado`)
			.setAuthor(message.author.username, message.author.displayAvatarURL)
			.setColor("56BD00")
			.setDescription(`${result}`);
		message.channel.send({ embed });
	}
	catch (err) {
		console.log("Ocurrió un error al evaluar la expresión " + expresion + " " + err);
		const embed = new Discord.RichEmbed()
			.setTitle(`Resultado`)
			.setAuthor(message.author.username, message.author.displayAvatarURL)
			.setColor("BD1800")
			.setDescription(`Lo siento, no entendí la expresión. Recuerda usar punto para separar decimales`);
		message.channel.send({ embed });
	};
}

module.exports.config = {
	name: "calc",
	aliases: ["calcular", "clc"],
	activo : true,
	configurable: true
}