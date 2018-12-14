const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
	args.shift().toLowerCase();
	message.delete();

	if (!message.member.roles.find("name", "director")) {
		message.channel.send('Necesitas el rol "director" para utilizar este comándo.');
		return;
	}

	if (isNaN(args[0])) {
		message.channel.send('Por favor, usa un número como argumento.');
		return;
	}

	const fetched = await message.channel.fetchMessages({ limit: args[0] });
	console.log(fetched.size + ' mensajes encontrados, eliminando...');

	message.channel.bulkDelete(fetched)
		.catch(error => message.channel.send(`Error: ${error}`)); // If it finds an error, it posts it into the channel.
}

module.exports.help = {
	name: "purga"
}