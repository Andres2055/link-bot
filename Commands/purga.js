const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
	message.delete();

	if (!message.member.roles.find("name", "director")) {
		message.channel.send('No eres tu, soy yo. Si no eres "director" no podemos tener nada.');
		return;
	}

	if (isNaN(args[0])) {
		message.channel.send('Por favor, usa un número como argumento.');
		return;
	}

	if (args[0] > 100) {
		message.channel.send('Eh, son más de 100 mensajes, ¿qué pretendes hacer?');
		return;
	}

	const fetched = await message.channel.fetchMessages({ limit: args[0] });
	console.log(fetched.size + ' mensajes encontrados, eliminando...');

	message.channel.bulkDelete(fetched)
		.catch(error => message.channel.send(`Error: ${error}`));
}

module.exports.help = {
	name: "purga",
	aliases: ["delet", "elim"]
}