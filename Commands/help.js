'use strict';
const Discord = require("discord.js");

const checkMD = message => {
	if (message.channel.type === "dm") {
		return;
	} else {
		return `Y-yo... te envié un mensaje <@${message.author.id	}>`;
	}
}

module.exports = async (client, message, args) => {
	const commands = client.command_help;
	var embed = new Discord.RichEmbed().setColor(0x1D82B6);
	embed.setTitle("Ayuda");
	embed.setFooter(`Para conocer los comandos de cierto grupo escribe !help [grupo]. También puedes usar !help [comando] para ver el detalle de un comando en específico. Recuerda que abusar del uso de un comando hará que este sea desactivado automáticamente`);

	const guild = client.guilds.find(guild => guild.name == client.config.get("SERVER").NAME);
	var member = guild.member(message.author);
	var grupos_visibles = [];
	for (let [k, v] of Object.entries(client.config.get("COMMMAND_GROUPS"))) {
		let accesible = false;
		v.ROLES.forEach(rol => {
			if (member.roles.some(role => role.name === rol)) { accesible = true; }
		});
		if (accesible) { grupos_visibles.push(k) }
	}
	

	if (args.length === 0 || args.join(' ').toUpperCase() === 'GRUPOS') {
		embed.setDescription(`Hola, mis comandos se dividen en diferentes grupos con una configuración propia. Según tu nivel de autorización, estos son los grupos a los que tienes acceso:`);
		embed.addField("**Grupos**", grupos_visibles.join("\n"));
		message.author.send({ embed })
		if (message.channel.type != 'dm') {
			message.channel.send({
				embed: {
					color: 0x1D82B6,
					description: checkMD(message)
				}
			})
		}
	} else {
		if (args.length > 1) {
			message.channel.send(`${args.join(" ")} no es un término de búsqueda válido`);
			return;
		}
		let busqueda = args.join("").toUpperCase().trim();
		if (grupos_visibles.includes(busqueda)) {
			//Búsqueda por grupo
			let comandos_accesibles = commands.filter(c => c.group == busqueda);
			embed.setDescription(`Hola, estos son los comandos exclusivos al grupo **${busqueda}** a los que tienes acceso:`);
			comandos_accesibles.forEach(cmd => {
				//console.log(cmd.alias);
				let c = `**Alias:** ${cmd.alias.join(" / ")}
				**Descripción:** ${cmd.desc}
				**Uso:** ${cmd.usage}\n`
				embed.addField(`Comando: **${cmd.name}**`, c);
			});

			message.author.send({ embed });
			if (message.channel.type != 'dm') {
				message.channel.send({
					embed: {
						color: 0x1D82B6,
						description: checkMD(message)
					}
				});
			}
		} else {
			//Búsqueda por commandname
			busqueda = busqueda.toLowerCase();
			let comando = commands.find(c => grupos_visibles.includes(c.group) && (c.name === busqueda || c.alias.includes(busqueda)));
			if (!comando) {
				message.channel.send(`No encontré ningún grupo/comando llamado ${busqueda} al que tengas acceso`);
				return;
			}
			embed.setDescription(`Hola, este es el detalle del comando **${busqueda}**`);
			let c = `**Alias:** ${comando.alias.join(" / ")}
				**Descripción:** ${comando.desc}
				**Uso:** ${comando.usage}\n`
			embed.addField(`Comando **${comando.name}**`, c);
			message.author.send({ embed });
			if (message.channel.type != 'dm') {
				message.channel.send({
					embed: {
						color: 0x1D82B6,
						description: checkMD(message)
					}
				});
			}
		}

	}
}

module.exports.config = {
	name: "help",
	aliases: ["h", "ayuda"],
	activo: true,
	configurable: false,
	grupo: "GENERAL",
	contador: 0,
	mp: true
}