const Discord = require("discord.js");
const client = new Discord.Client();
const Scpper = require("scpper.js");
const fs = require('fs')

client.commands = new Discord.Collection()
*/config = JSON.parse(fs.readFileSync('./config.json'), 'utf8')*/

fs.readdir("./Commands/", (err, files) => {
	if (err) console.log(err);

	let jsfile = files.filter(f => f.split(".").pop() === "js");
	if(jsfile.length <= 0) {
		console.log(">>> No se encontraron comandos");
		return;
	}

	jsfile.forEach((f, i) => {
		let props = require(`./Commands/${f}`)
		console.log(`¡${f} cargado!`)
		client.commands.set(props.help.name, props)
	});
})

const prefix = "!"

/*const ep = api.findUsers('LazyLasagne')

ep.then(function(value) {
	page = value['data']
	console.log(page)
	console.log(page['users'][0]['activity'])

});*/

client.on("ready", () => {
	console.log("¡Estoy listo!");
	client.user.setActivity('Cada !help ayuda a 3 desamparados')
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find(ch => ch.name === 'lobby');
  if (!channel) return;
  channel.send(`¡Bienvenido al Sitio-34, ${member}! Por favor, recuerda checar #reglas-leer-primero antes de escribir algo.`);
});

client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.find(ch => ch.name === 'lobby');
  if (!channel) return;
  channel.send(`¡Adios, adios, ${member}! Nos vemos luego`);
});

/*client.on('guildBanAdd', member => {
  const channel = member.guild.channels.find(ch => ch.name === 'entradas');
  if (!channel) return;
  channel.send(`Bienvenido al Sitio-34, ${member}`);
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find(ch => ch.name === 'lobby');
  if (!channel) return;
  channel.send(`Bienvenido al Sitio-34, ${member}`);
});*/

client.on("message", (message) => {

	function msgR() { //%10 de que salga
		msgNum = 1 + Math.floor(Math.random() * 10);
		if (msgNum != 10) {} else {
			msgNum = 1 + Math.floor(Math.random() * 10);
			if (msgNum === 1) {
				message.channel.send("y eso es todo lo que escribí.")
			} else if (msgNum === 2) {
				message.channel.send("¿Reconoces los cuerpos en el agua, <@" + message.author.id + ">?")
			} else if (msgNum === 3) {
				message.channel.send("Sexando los procedimientos de contención.")
			} else if (msgNum === 4) {
				message.channel.send("Si no podemos ir al Paraíso, haré que el Paraíso venga a nosotros. Todo por ~~Nuestro Señor~~ Nuestra Estrella.")
			} else if (msgNum === 5) {
				message.channel.send("Casi puedo sentir los gritos, gritos en fila, o curvándose. En la oscuridad de la irrealidad. No quiero gritar en patrones, por favor, <@" + message.author.id + ">")
			} else if (msgNum === 6) {
				message.channel.send("Si me permites... tengo que tomar un ascensor.")
			} else if (msgNum === 7) {
				orangutan = 1 + Math.floor(Math.random() * 9)
				if (orangutan === 9) {message.channel.send("Nueve orangutanes.")}
				else if (orangutan === 8) {message.channel.send("Ocho orangutanes.")}
				else if (orangutan === 7) {message.channel.send("Siete orangutanes.")}
				else if (orangutan === 6) {message.channel.send("Seis orangutanes.")}
				else if (orangutan === 5) {message.channel.send("Cinco orangutanes.")}
				else if (orangutan === 4) {message.channel.send("Cuatro orangutanes.")}
				else if (orangutan === 3) {message.channel.send("Tres orangutanes.")}
				else if (orangutan === 2) {message.channel.send("Dos orangutanes.")}
				else if (orangutan === 1) {message.channel.send("Uno orangutanes.")}
			} else if (msgNum === 8) {
				message.channel.send("Todos nos hemos reído, pero ya no es gracioso.")
			} else if (msgNum === 9) {
				message.channel.send("Woowee veh i matate <@" + message.author.id + ">")
			}
		}
	}

	if (message.content.startsWith(prefix) && message.author.id != "520480436107870211") {
		const args = message.content.trim().split(/ +/g);
		console.log(args)

		let commandFile = client.commands.get(args[0].slice(prefix.length));
		console.log(commandFile)

		if(commandFile) commandFile.run(client, message, args)
		else {
			message.channel.send('Introduzca un comando válido');
		}
		msgR();
	}

	if (message.content.startsWith('uwu')) {
		message.channel.send("¡DON\'T UWU!");
	}
});


try {
	client.login("MjkzNTQzOTM2OTAxNzc1Mzcx.DvBPuQ.8p29cNQ31vTIZqBew8c0ouUmOzY");
} catch(err) {
	console.error(err)
}
