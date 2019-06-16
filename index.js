const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const config = require("./Storage/config.json");

/* Deviroment Variables */

const PREFIX = config['PREFIX'] || process.env.PREFIX
const TOKEN = config['TOKEN'] || process.env.TOKEN
const SCPDIARY_TIME = config["SCPDIARY_TIME"] || 60000

/* Deviroment Variables */
/* Commands */

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

fs.readdir("./Commands/", (err, files) => {
	if (err) console.log(err);

	let jsfile = files.filter(f => f.split(".").pop() === "js");
	if (jsfile.length <= 0) {
		return console.log(">>> No se encontraron comandos");
	}

	jsfile.forEach((f, i) => {
		let props = require(`./Commands/${f}`)
		console.log(`¡${f} cargado!`)
		client.commands.set(props.help.name, props)
		props.help.aliases.forEach(alias => {
			client.aliases.set(alias, props.help.name)
		})
	});
});



/* Commands */
/* Client */

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
	}, SCPDIARY_TIME*24)

	const scpDiary = require('./scpDiary.js')
	setInterval(() => {
		scpDiary.postSCPDiary(client)
	}, SCPDIARY_TIME)

});

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === 'lobby');
	if (!channel) return;
	channel.send(`¡Heya ${member}! Ten un... supongo... un, ¡si! ¡Una buena charla! Recuerda mirar #reglas-leer-primero antes de si quiera pensar escribir un emoji. Digo, ¡SI!`);
});

client.on('guildMemberRemove', member => {
	const channel = member.guild.channels.find(ch => ch.name === 'lobby');
	if (!channel) return;
	channel.send(`¡Adios, ${member}! Espero que vuelvas pronto :D.`);
});

client.on('guildBanAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === 'staff');
	if (!channel) return;
	channel.send(`${member}. Dios, no... pensé que realmente eras una buena persona, y ser baneado... supongo que no todas son buenas personas.`);
});

/*client.on('messageDelete', msg => {
	const channel = member.guild.channels.find(ch => ch.name === 'staff');
	if (!channel) return;
	channel.send(`${member} ha sido baneado del servidor.`);
});*/

client.on("message", message => {
	const isMuted = message.member.roles.find(rol => toLowerCase(rol.name) == "muted")
	if (isMuted) {
		message.delete();
	}

	var msgR = () => { //%10 de que salga
		let msgNum = 1 + Math.floor(Math.random() * 10);
		if (msgNum != 10) {} else {
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
				`asi puedo sentir los gritos, gritos en fila, o curvándose. En la oscuridad de la irrealidad. No quiero gritar en patrones, por favor, <@${message.author.id}>`,
				"Si me permites... tengo que tomar un ascensor.",
				"Todos nos hemos reído, pero ya no es gracioso.",
				`Woowee veh i matate <@${message.author.id}>`,
				theOrangutan(orangutan),
				'* lo lame *'
			]

			return preSendMsg[msgNum2]
		}
	}

	if (!message.author.bot) {


		let messageArray = message.content.split(/ +/g);
		let cmd = messageArray[0].toLowerCase();
		let args = messageArray.slice(1)

		msgR();


		if (!message.content.startsWith(PREFIX)) return;
		let commandsName = client.commands.get(cmd.slice(PREFIX.length));
		let aliasesName = client.commands.get(client.aliases.get(cmd.slice(PREFIX.length)));
		let commandFile = commandsName || aliasesName;

		if (commandFile) commandFile.run(client, message, args)
		else {
			message.channel.send(`Uh, ese no es un comando válido. Revisa los comandos con ${PREFIX}help.`);
		}
	}

	/*const msgOriginal = message;
	const msgLower = message.content.toLowerCase();

	if (msgLower.startsWith('uwu')) {
		message.channel.send("¡DON\'T UWU!");
	};*/
});

/* Client */
/* Login */

try {
	client.login(TOKEN);
} catch (err) {
	console.log(err)
}

/* Login */
