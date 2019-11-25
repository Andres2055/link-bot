'use strict';
module.exports = async (client, message, args) => {
	var name = message.member.nickname ? message.member.nickname : message.member.user.username;
	if (args[0] != undefined) {
		let msg = args.join(" ");
		message.channel.send(`**${name}** ha pagado sus respetos a **${msg}**`)
	} else {
		message.channel.send(`**${name}** ha pagado sus respetos`)
	}
}

module.exports.config = {
	name: "f",
	aliases: ["pay"],
	activo: true,
	configurable: true,
	grupo: "OCIO",
	contador: 0
}