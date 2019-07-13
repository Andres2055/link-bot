const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
//const antispam = require("antispam-discord")
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
/* Anti Spam */

/*let cooldown = {};

setInterval(() => {
	if(!cooldown) return;
	for(let x in cooldown) {
		now = Date.now()
		console.log(">>>", cooldown)
		console.log(cooldown[x][1] - 30000)
		console.log((cooldown[x][1] - 30000) < now)
		if((cooldown[x][1] - 30000) < now) {
			cooldown[x][1] = 0;
		}
	}
}, 10000)*/

/* Anti Spam */
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
	channel.send(`¡Adios, ${member}! Espero que vuelvas pronto :D`);
});

client.on('guildBanAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === 'entradas');
	if (!channel) return;
	channel.send(`${member.name} ha sido baneado`);
});

client.on("message", message => {
	if(message.channel.type != "dm") {
		const isMuted = message.member.roles.find(rol => rol.name.toLowerCase() == "muted")
		if (isMuted) {
			message.delete()
				.then(msg => console.log(`Mensaje de ${msg.author.username} borrado`))
				.catch(console.error)
			return;
		}

		/*let adv_roles = {}
		adv_roles["n1"] = message.member.guild.roles.find(rol => rol.name === 'Advertencia de Nivel 1')
		adv_roles["n2"] = message.member.guild.roles.find(rol => rol.name === 'Advertencia de Nivel 2')
		adv_roles["muted"] = message.member.guild.roles.find(rol => rol.name === 'Muted')*/
	}

	var msgR = () => { //%10 de que salga
		let msgNum = 1 + Math.floor(Math.random() * 10);
		console.log(msgNum)
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

	var checkIt = (to_check_cmd) => {
		const alert = ["scp", "scpr", "user", "autor", "art", "artr", "tag", "etiq"]
		for (let i = 0; i < alert.length; i++) {
			if(to_check_cmd == alert[i]) {
				return true;
			}
		}
	}

	var isOcio = (ocio_cmd) => {
		const alert = ["bola8", "b8", "8b", "img", "f"]
		for (let i = 0; i < alert.length; i++) {
			if(ocio_cmd == alert[i]) {
				return true;
			}
		}
	}

	if (!message.author.bot) {
		let messageArray = message.content.split(/ +/g);
		let cmd = messageArray[0].toLowerCase();
		let args = messageArray.slice(1)
		if (!message.content.startsWith(PREFIX)) return;
		/*if(isOcio(cmd.slice(PREFIX.length)) && message.channel.type != "dm") {
			if(cooldown[message.author.id]) {
				cooldown[message.author.id][0] += 1;
			} else if(!cooldown[message.author.id]) {
				cooldown[message.author.id] = [1, 0, 0]
			}

			console.log("------------\n", cooldown)


			if(cooldown[message.author.id][0] == 10) {
				console.log("¡shut up!")
				cooldown[message.author.id][0] = 0;
				cooldown[message.author.id][1] = Date.now() + 30000;
				cooldown[message.author.id][2] += 1;
				console.log(cooldown)
				if(cooldown[message.author.id][2] == 3) {
					message.member.addRole(adv_roles.n1)
				} else if(cooldown[message.author.id][2] == 6) {
					message.member.removeRole(adv_roles.n1)
					message.member.addRole(adv_roles.n2)
				} else if(cooldown[message.author.id][2] > 7) {
					message.member.removeRole(adv_roles.n2)
					message.member.addRole(adv_roles.muted)
				}
			}
		}
		console.log(cooldown[message.author.id])
		if(cooldown[message.author.id][1] != 0) {
			console.log("nope")
			return;
		}*/ 
		let commandsName = client.commands.get(cmd.slice(PREFIX.length));
		let aliasesName = client.commands.get(client.aliases.get(cmd.slice(PREFIX.length)));
		let commandFile = commandsName || aliasesName;

		if (commandFile) { 
			if(checkIt(cmd.slice(PREFIX.length))) { msgR(); }
			commandFile.run(client, message, args);
		} else {
			message.channel.send(`Uh, ese no es un comando válido. Revisa los comandos con ${PREFIX}help.`);
		}
	}
});

/* Client */
/* Login */

try {
	client.login(TOKEN);
} catch (err) {
	console.log(err)
}

/* Login */
