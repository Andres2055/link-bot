const Discord = require("discord.js");
const fs = require('fs');

const commands = JSON.parse(fs.readFileSync('./Storage/commands_help.json'), 'utf8');

const checkMD = message => {
	if (message.channel.type === "dm") {
		return;
	} else {
		return `Revisa tus Mensajes Directos <@${message.author.id}>`;
	}
}

module.exports.run = async (client, message, args) => {
	if (args.length === 0) {

		const embed = new Discord.RichEmbed()
			.setColor(0x1D82B6)

		let commandsFound = 0;

		for (var cmd in commands) {
			if (commands[cmd].group.toUpperCase() === 'USUARIO') {
				commandsFound += 1
				embed.addField(`:information_source:  ${commands[cmd].name}`, `**Descripción:** ${commands[cmd].desc}\n**Uso:** !${commands[cmd].usage}`);
			}
		}

		embed.setFooter(`Actualmente está viendo el grupo de comandos "usuario". Para ver otro grupo escriba !help [grupo / comando]. Para ver todos los grupos, escriba !help grupos.`)
		embed.setDescription(`**${commandsFound} comandos encontrados** - <> significa requerimiento, [] significa opcional`)

		message.author.send({ embed })
		message.channel.send({
			embed: {
				color: 0x1D82B6,
				description: checkMD(message)
			}
		})

	} else if (args.join(' ').toUpperCase() === 'GRUPOS') {

		// Variables
		let groups = '';

		for (var cmd in commands) {
			if (!groups.includes(commands[cmd].group)) {
				groups += `${commands[cmd].group}\n`
			}
		}

		message.channel.send({
			embed: {
				description: `**${groups}**`,
				title: "Grupos",
				color: 0x1D82B6
			}
		})

		return;

	} else {

		let groupFound = '';

		for (var cmd in commands) {
			if (args.join(" ").trim().toUpperCase() === commands[cmd].group.toUpperCase()) {
				groupFound = commands[cmd].group.toUpperCase();
				break;
			}
		}

		if (groupFound != '') {

			const embed = new Discord.RichEmbed()
				.setColor(0x1D82B6)

			let commandsFound = 0;

			for (var cmd in commands) {
				if (commands[cmd].group.toUpperCase() === groupFound) {
					commandsFound += 1
					embed.addField(`:information_source: ${commands[cmd].name}`, `**Descripción:** ${commands[cmd].desc}\n**Uso:** !${commands[cmd].usage}`);
				}
			}

			embed.setFooter(`Actualmente está viendo el grupo de comandos "${groupFound}". Para ver otro grupo escriba !help [grupo / comando]. Para ver todos los grupos, escriba !help grupos.`)
			embed.setDescription(`**${commandsFound} comandos encontrados** - <> significa requerimiento, [] significa opcional`)

			message.author.send({ embed })
			message.channel.send({
				embed: {
					color: 0x1D82B6,
					description: checkMD(message)
				}
			})

			return;
		}

		let commandFound = '';
		let commandDesc = '';
		let commandUsage = '';
		let commandGroup = '';

		for (var cmd in commands) { // Copy and paste
			if (args.join(" ").trim().toUpperCase() === commands[cmd].name.toUpperCase()) {
				commandFound = commands[cmd].name;
				commandDesc  = commands[cmd].desc;
				commandUsage = commands[cmd].usage;
				commandGroup = commands[cmd].group;
				break;
			}
		}

		if (commandFound === '') {
			message.channel.send({
				embed: {
					description: `**No se encotró el comando o grupo llamado \`${args.join(" ")}\`**`,
					color: 0x1D82B6,
				}
			})
		}

		message.channel.send({
			embed: {
				title: '<> significa requerimiento, [] significa opcional',
				color: 0x1D82B6,
				fields: [{
					name: commandFound,
					value: `**Descripción:** ${commandDesc}\n**Uso:** ${commandUsage}\n**Grupo:** ${commandGroup}`
				}]
			}
		})
		return;
	}
}

module.exports.help = {
	name: "help",
	aliases: ["h", "ayuda"]
}