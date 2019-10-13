const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const config = require("./Storage/config.json");
const grupos = require("./Storage/config.json").COMMMAND_GROUPS;
//const antispam = require("antispam-discord")

/* Environment Variables */
const PREFIX = config['PREFIX'] || process.env.PREFIX
const TOKEN = config['TOKEN'] || process.env.TOKEN
const SCPDIARY_TIME = config["SCPDIARY_TIME"] || 60000

var jsfile = [];

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

fs.readdir("./Commands/", (err, files) => {
	if (err) console.log(err);

	jsfile = files.filter(f => f.split(".").pop() === "js");
	if (jsfile.length <= 0) {
		return console.log(">>> No se encontraron comandos");
	}

	jsfile.forEach(f => {
		let props = require(`./Commands/${f}`)
		console.log(`¡${f} cargado!`)
		client.commands.set(props.config.name, props)
		props.config.aliases.forEach(alias => {
			client.aliases.set(alias, props.config.name)
		})
	});
	console.log(`Todos los comandos cargados`)
});

client.on("ready", () => {
	console.log("¡Estoy listo!");
	var msgActivity = ["Cada !help cura mi depresión",
		"Un !help es igual a un abrazo",
		"Necesitas el !help tanto como yo a ti",
		"Lo hago porque te quiero",
		"!help, ¡HELP! ¡HELP ME!"];

	var msgNum = Math.floor(Math.random() * msgActivity.length);

	client.user.setActivity(msgActivity[msgNum]);
	setInterval(() => {
		msgNum = Math.floor(Math.random() * msgActivity.length);
		client.user.setActivity(msgActivity[msgNum]);
	}, SCPDIARY_TIME * config.SERVER.ACTIVITY_INTERVAL)

	const scpDiary = require('./scpDiary.js')
	setInterval(() => {
		scpDiary.postSCPDiary(client)
	}, SCPDIARY_TIME)

});

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === config.SERVER.CHANNEL_WELCOME);
	if (!channel) return;
	channel.send(`¡Heya ${member.user}! Ten un... supongo... un, ¡si! ¡Una buena charla! Recuerda mirar #reglas-leer-primero antes de si quiera pensar escribir un emoji. Digo, ¡SI!`);
});

client.on('guildMemberRemove', member => {
	const channel = member.guild.channels.find(ch => ch.name === config.SERVER.CHANNEL_FARAWELL);
	if (!channel) return;
	channel.send(`¡Adios, **${member.user}**! Espero que vuelvas pronto :D`);
});

client.on('guildBanAdd', (guild, user) => {
	const channel = guild.channels.find(ch => ch.name === config.CHANNEL_FARAWELL);
	if (!channel) return;
	channel.send(`${user.tag} ha sido baneado`);
});

client.on("message", message => {

	var validarPermisos = (message, comando) => {
		let v = false;
		//Si el comando es del grupo General, entonces no es necesario validar roles
		if (comando.config.grupo == config.SERVER.GENERAL_GROUP) {
			return true;
		}
		//Valida que no se intente usar comandos administrativos por mensaje privado
		if (config.SERVER.ADMIN_GROUPS.includes(comando.config.grupo) && message.channel.type === "dm") {
			message.channel.send("Oye, oye, oye, las acciones administrativas van en el canal de #staff (」゜ロ゜)」");
			return false;
		}
		//validación de roles de acuerdo con el grupo correspondiente del comando
		grupos[comando.config.grupo].ROLES.forEach(rol => {
			if (message.member.roles.some(role => role.name === rol)) { v = true; }
		});
		return v;
	}

	if (!message.author.bot) {
		try {
			if (!message.content.startsWith(PREFIX)) return;
			let messageArray = message.content.split(/ +/g);
			let cmd = messageArray[0].toLowerCase().slice(PREFIX.length);
			let args = messageArray.slice(1)
			
			let commandsName = client.commands.get(cmd);
			let aliasesName = client.commands.get(client.aliases.get(cmd));
			let commandFile = commandsName || aliasesName;
			if (commandFile) {
				if (commandFile.config.activo) {
					if (!validarPermisos(message, commandFile)) {
						message.channel.send(`Lo siento ${message.author} pero no tienes permiso para usar este comando`);
						return
					}
					if (commandFile.config.mensaje_espera) { msgR(message); }//fixme mandar mensaje cuando sea un comando de SCP
					commandFile(client, message, args);
				} else {
					message.channel.send(`Ese comando ha sido desactivado. F`);
				}
			} else {
				message.channel.send(`Uh, ese no es un comando válido. Revisa los comandos con ${PREFIX}help.`);
			}
		} catch {
			error => {
				console.log("Error: " + error);
				const guild = client.guilds.find(guild => guild.name === config.NAME);
				let developer = guild.members.find(mem => mem.name == config.SERVER.DEVELOPER);
				developer.send(`Oye, acaba de pasar algo en el server ${guild.name} revisa mi log. El error es: ${error}`)
			}
		}
	}
});

var msgR = (message) => { //%10 de que salga
	let msgNum = 1 + Math.floor(Math.random() * 10);
	console.log(msgNum)
	if (msgNum != 10) { } else {
		let msgNum2 = Math.floor(Math.random() * 9);
		let orangutan = Math.floor(Math.random() * 9);

		var theOrangutan = (ora) => {
			return (ora > 7) ? `${orangutanes[ora]} orangután` : `${orangutanes[ora]} orangutanes`
		}

		var orangutanes = [
			"Nueve", "Ocho", "Siete",
			"Seis", "Cinco", "Cuatro",
			"Tres", "Dos", "Un"
		]

		var preSendMsg = [
			"y eso es todo lo que escribí.",
			`¿Reconoces los cuerpos en el agua, <@${message.author.id}>?`,
			"Sexando los procedimientos de contención.",
			"Si no podemos ir al Paraíso, haré que el Paraíso venga a nosotros. Todo por ~~Nuestro Señor~~ Nuestra Estrella.",
			`Casi puedo sentir los gritos, gritos en fila, o curvándose. En la oscuridad de la irrealidad. No quiero gritar en patrones, por favor, <@${message.author.id}>`,
			"Si me permites... tengo que tomar un ascensor.",
			"Todos nos hemos reído, pero ya no es gracioso.",
			`Woowee veh i matate <@${message.author.id}>`,
			theOrangutan(orangutan),
			'* lo lame *'
		]
		message.channel.send(preSendMsg[msgNum2])
	}
}

/* Client */
/* Login */

try {
	client.login(TOKEN);
} catch (err) {
	console.log(err)
}