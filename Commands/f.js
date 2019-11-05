module.exports = async (client, message, args) => {
	var name = message.member.nickname ? message.member.nickname : message.member.name;
	if (args[0] != undefined) {
		msg = ''
		for (var i = 0; i < args.length; i++) { msg += args[i] + ' ' }
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