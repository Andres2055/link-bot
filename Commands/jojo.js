const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
	const jojo = 1 + Math.floor(Math.random() * 100);

	console.log(message.channel.permissionsFor(message.member))

	if (jojo < 90) {
		let jojo = message.channel.guild.roles.find(role => role.name == "Jojos");
		let newJojos = message.channel.guild.fetchMember(message.author);

		message.channel.guild.members.find(member => {
			if(member.roles.has(jojo.id)) {
				if(member.id != message.author.id) {
					member.removeRole(jojo.id)
						.then(`Rol jojo quitado a ${message.author.id}`);
				}
				newJojos.then(member => member.addRole(jojo.id)
					.then(`Rol jojo asignado a ${message.author.id}`));
				return message.channel.send(`¡<@${message.author.id}> es el <@&${jojo.id}>!`);
			} else {
				newJojos.then(member => member.addRole(jojo.id)
					.then(`Rol jojo asignado a ${message.author.id}`));
				return message.channel.send(`¡<@${message.author.id}> es el <@&${jojo.id}>!`);
			}
		})
	} else {
		message.channel.send(`<@${message.author.id}> no es el JoJos`);
	}
}

module.exports.help = {
	name: "jojo",
	aliases: ["jojos"]
}