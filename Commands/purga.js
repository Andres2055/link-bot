const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
	message.delete();

	if (!message.member.roles.find("name", "director")) {
		message.channel.send('Necesitas el rol "director" para utilizar este comándo.');
		return;
	}

	if (isNaN(args[0])) {
		message.channel.send('Por favor, use un número como argumento.');
		return;
	}

	if (args[0] > 100) {
		message.channel.send('El límite de mensajes a borrar es menor a 100.');
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