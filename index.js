const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const config_json = new Map(Object.entries(require("./Storage/config.json")));
const config_var = require("./Storage/config.json");

/* Environment Variables */
const PREFIX = config_var['PREFIX'] || process.env.PREFIX
const TOKEN = config_var['TOKEN'] || process.env.TOKEN
const SCPDIARY_TIME = config_var["SCPDIARY_TIME"] || 60000

client.commands = new Discord.Collection(); //Guarda una colección con los comandos disponibles para el bot
client.aliases = new Discord.Collection(); //Guarda una colección con los comandos disponibles para el bot accesibles mediante el alias
client.config = new Discord.Collection(); //Guarda una colección con las configuraciones tomadas del jsonConfig para su acceso global
client.functions = new Discord.Collection(); //Guarda una coleción con funciones de utilidad que pueden ser usadas por cualquier comando
client.registros = new Discord.Collection(); //Guarda una colección de los registros auditables de acciones

//========================================================
// Inicializa comandos, configuración, funciones internas 
// y colecciones necesarias para el funcionamiento del bot
//========================================================

fs.readdir("./Commands/", (err, files) => {
	if (err) return console.log(err);
	var jsfile = files.filter(f => f.split(".").pop() === "js");
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
	console.log("¡Todos los comandos cargados!");

	for (let [key, value] of config_json.entries()) {
		console.log(`¡Configuración para ${key} cargada!`)
		client.config.set(key, value);
	}
	console.log("¡Settings setteadas!");
	
	const internal_function = require("./Functions/internal.js");
	client.functions.set("NOTIFY", internal_function.notificar);
	client.functions.set("BLOQUEO_COMANDO", internal_function.bloqueaComandoSpam);
	client.functions.set("MSN_R", internal_function.msgR);
	internal_function.agregarIntervalos(client);
	console.log("¡Funciones internas listas!");
});

//========================================================
// Código que se ejecutará una vez que el bot haga login
//========================================================

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
	}, SCPDIARY_TIME * client.config.get("SERVER").ACTIVITY_INTERVAL);

	const scpDiary = require('./Functions/scpDiary.js');
	setInterval(() => {
		scpDiary.postSCPDiary(client)
	}, SCPDIARY_TIME);
});

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === client.config.get("SERVER").CHANNEL_WELCOME);
	if (!channel) return;
	channel.send(`¡Heya ${member.user}! Ten un... supongo... un, ¡si! ¡Una buena charla! Recuerda mirar #reglas-leer-primero antes de si quiera pensar escribir un emoji. Digo, ¡SI!`);
});

client.on('guildMemberRemove', member => {
	const channel = member.guild.channels.find(ch => ch.name === client.config.get("SERVER").CHANNEL_FARAWELL);
	if (!channel) return;
	channel.send(`¡Adios, **${member.user.username}**! Espero que vuelvas pronto :D`);
});

client.on('guildBanAdd', (guild, user) => {
	const channel = guild.channels.find(ch => ch.name === client.config.get("SERVER").CHANNEL_FARAWELL);
	if (!channel) return;
	channel.send(`${user.tag} ha sido baneado`);
});

client.on("message", message => {

	var validarPermisos = (message, comando) => {
		let v = false;
		//Si el comando es del grupo General, entonces no es necesario validar roles
		if (comando.config.grupo == client.config.get("SERVER").GENERAL_GROUP) {
			return true;
		}
		//Valida que no se intente usar comandos administrativos por mensaje privado
		if (client.config.get("SERVER").ADMIN_GROUPS.includes(comando.config.grupo) && message.channel.type === "dm") {
			message.channel.send("Oye, oye, oye, las acciones administrativas van en el canal de #staff (」゜ロ゜)」");
			return false;
		}
		//validación de roles de acuerdo con el grupo correspondiente del comando
		client.config.get("COMMMAND_GROUPS")[comando.config.grupo].ROLES.forEach(rol => {
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
					if (client.config.get("COMMMAND_GROUPS")[commandFile.config.grupo].NUM_USOS) {
						console.log(`El comando ${commandFile.config.name} se ha usado ${commandFile.config.contador} veces. Puede usarse sólo ${client.config.get("COMMMAND_GROUPS")[commandFile.config.grupo].NUM_USOS} veces`);
					}
					if (client.config.get("COMMMAND_GROUPS")[commandFile.config.grupo].NUM_USOS && commandFile.config.contador >= client.config.get("COMMMAND_GROUPS")[commandFile.config.grupo].NUM_USOS) {
						let bloqueaComandoSpam = client.functions.get("BLOQUEO_COMANDO");
						bloqueaComandoSpam(commandFile, message, client);
						return
					}
					if (!validarPermisos(message, commandFile)) {
						message.channel.send(`Lo siento ${message.author} pero no tienes permiso para usar este comando`);
						return
					}
					if (commandFile.config.grupo == 'SCP') {
						let msgR = client.functions.get("MSN_R");
						msgR(message);
					}
					commandFile.config.contador += 1;
					commandFile(client, message, args);
				} else {
					message.channel.send(`Ese comando ha sido desactivado. F`);
				}
			} else {
				message.channel.send(`Uh, ese no es un comando válido. Revisa los comandos con ${PREFIX}help.`);
			}
		} catch (error) {
			let notify = client.functions.get("NOTIFY");
			notify(error, client);
		}
	}
});

//=============
// *  Client  *
// *  Login   *
//=============
try {
	client.login(TOKEN);
} catch (err) {
	console.log(err);
}