const roles = require("../Storage/config.json").COMMMAND_GROUPS.ADMIN.ROLES;

module.exports = async (client, message, args) => {
	message.delete();

	if (!message.member.roles.find(role => roles.includes(role.name))) {
		message.channel.send('No eres tú, soy yo. Si no eres "director" no podemos tener nada u-u.');
		return;
	}

	if (isNaN(args[0])) {
		message.channel.send('Por favor, usa un número como argumento.');
		return;
	}

	if (args[0] > 100) {
		message.channel.send('Eh, son más de 100 mensajes, ¿qué pretendes hacer?  (ﾟロﾟ) ! ');
		return;
	}

	const fetched = await message.channel.fetchMessages({ limit: args[0] });
	console.log(fetched.size + ' mensajes encontrados, eliminando...');

	message.channel.bulkDelete(fetched)
		.catch(error => message.channel.send(`Error: ${error}`));
}

module.exports.config = {
	name: "purga",
	aliases: ["delet", "elim"],
	activo : true,
	configurable: true,
	grupo: "MODERADORES"
}