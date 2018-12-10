const Discord = require("discord.js");
const Scpper = require("scpper.js");

const api = new Scpper.Scpper({ site: 'es' })
const client = new Discord.Client();

/*const ep = api.findUsers('LazyLasagne')

ep.then(function(value) {
	page = value['data']
	console.log(page)
	console.log(page['users'][0]['activity'])

});*/

client.on("ready", () => {
	console.log("¡Estoy listo!");
	client.user.setActivity('Cada !h ayuda a 3 desamparados')
});

client.on("message", (message) => {
	function mention() {
		return client.users.find('username', message.author.username).toString()
	}

	function marv() { //%10 chance to qoute Marvin after a successful command
		marvNum = 1 + Math.floor(Math.random() * 10);
		if (marvNum != 10) {} else {
			marvNum = 1 + Math.floor(Math.random() * 6);
			if (marvNum === 1) {
				message.channel.send("y eso es todo lo que escribí.")
			} else if (marvNum === 2) {
				message.channel.send("¿Reconoces los cuerpos en el agua, " + mention() + "?")
			} else if (marvNum === 3) {
				message.channel.send("Sexando los procedimientos de contención.")
			} else if (marvNum === 4) {
				message.channel.send("Si no podemos ir al Paraíso, haré que el Paraíso venga a nosotros. Todo por ~~Nuestro Señor~~ Nuestra Estrella.")
			} else if (marvNum === 5) {
				message.channel.send("Casi puedo sentir los gritos, gritos en fila, o curvándose. En la oscuridad de la irrealidad. No quiero gritar en patrones, por favor, " + mention())
			} else if (marvNum === 6) {
				message.channel.send("Si me permites... tengo que tomar un ascensor.")
			}
		}
	}

	if (message.content.startsWith("!") && message.author.id != "460928002067398666") {
		const args = message.content.trim().split(/ +/g);
		console.log(args)
		var command = args.shift().toLowerCase();
		command = command.split("!").pop();
		var inp = args[0];
		if (inp != null) {
			inp = inp.toLowerCase();
		}

		if (command == "scp") {
			if (args.length === 2) {
				site = args[0]
				query = args[1]
			} else {
				site = "es"
				query = args[0]
			}

			const scp = api.findPages('scp-' + query, { site: site })

			scp.then(function(value) {
				page = value['data']['pages'][0]

				if (page === undefined) {
					message.channel.send(mention() + ', introduzca un SCP válido');
				} else {
					if (page['status'] === "Translation") {
						status = '**Traducido por:** ' + page['authors'][0]['user'];
					} else if (page['status'] === "Original") {
						status = '**Creado por:** ' + page['authors'][0]['user'];
					};

					const embed = new Discord.RichEmbed()
						.setTitle( page['altTitle'] + ' (+' + page['adjustedRating'] + ')')
						.setURL(page['site'] + '\/' + page['name'])
						.setDescription(status + " (-" + site.toUpperCase() + ")")
		                .setAuthor(message.author.username, message.author.displayAvatarURL)
		                .setColor(0x588d9b) 

					message.channel.send({ embed });
				}
			});
		} else if (command == "scpr") {
			if (args.length === 1) {
				site = args[0]
			} else {
				site = "es"
			};

			scpr = api.findTag('scp', {
				site: site,
				random: true
			})

			scpr.then(function(value) {
				page = value['data']['pages'][0]

				if (page['status'] === "Translation") {
					status = '**Traducido por:** ' + page['authors'][0]['user'];
				} else if (page['status'] === "Original") {
					status = '**Creado por:** ' + page['authors'][0]['user'];
				};

				const embed = new Discord.RichEmbed()
						.setTitle( page['altTitle'] + ' (+' + page['adjustedRating'] + ')')
						.setURL(page['site'] + '\/' + page['name'])
						.setDescription(status + " (-" + site.toUpperCase() + ")")
		                .setAuthor(message.author.username, message.author.displayAvatarURL)
		                .setColor(0x588d9b) 

				message.channel.send({ embed });
			});
		} else if (command == "r") {
			site = args.pop()

			/*codigo feo por flojera*/

			if (site == 'en') {}
			else if (site == 'ru') {}
			else if (site == 'ko') {}
			else if (site == 'ja') {} 
			else if (site == 'fr') {} 
			else if (site == 'th') {} 
			else if (site == 'pl') {} 
			else if (site == 'de') {} 
			else if (site == 'cn') {} 
			else if (site == 'it') {} 
			else if (site == 'int') {}
			else {args.push(site); site = 'es'}

			args.push('-')
			query = args.slice(0, -1).join("-")
			const tale = api.findPages(query, { site: site })

			tale.then(function(value) {
				page = value['data']['pages'][0]

				if (page === undefined) {
					return message.channel.send(mention() + ', introduzca un relato válido');
				};


				if (page['status'] === "Translation") {
					status = '**Traducido por:** ' + page['authors'][0]['user'];
				} else if (page['status'] === "Original") {
					status = '**Creado por:** ' + page['authors'][0]['user'];
				};

				const embed = new Discord.RichEmbed()
						.setTitle( page['title'] + ' (+' + page['adjustedRating'] + ')')
						.setURL(page['site'] + '\/' + page['name'])
						.setDescription(status + " (-" + site.toUpperCase() + ")")
		                .setAuthor(message.author.username, message.author.displayAvatarURL)
		                .setColor(0x588d9b) 

				message.channel.send({ embed });
			});
		} else if (command == "rr") {
			rran = api.findTag('relato', { random: true })

			rran.then(function(value) {
				page = value['data']['pages'][0]

				if (page['status'] === "Translation") {
					status = '**Traducido por:** ' + page['authors'][0]['user'];
				} else if (page['status'] === "Original") {
					status = '**Creado por:** ' + page['authors'][0]['user'];
				};

				const embed = new Discord.RichEmbed()
						.setTitle( page['title'] + ' (+' + page['adjustedRating'] + ')')
						.setURL(page['site'] + '\/' + page['name'])
						.setDescription(status)
		                .setAuthor(message.author.username, message.author.displayAvatarURL)
		                .setColor(0x588d9b) 

				message.channel.send({ embed });
			});
		} else if (command == "tag") {
			site = args.pop()

			if (site == 'en') {}
			else if (site == 'ru') {}
			else if (site == 'ko') {}
			else if (site == 'ja') {} 
			else if (site == 'fr') {} 
			else if (site == 'th') {} 
			else if (site == 'pl') {} 
			else if (site == 'de') {} 
			else if (site == 'cn') {} 
			else if (site == 'it') {} 
			else if (site == 'int') {}
			else {args.push(site); site = 'es'}

			query = args
			console.log(query)

			const tag = api.findTag(query, {site: site,
											limit: 4, 
											random: true })

			tag.then(function(value) {
				page = value['data']['pages']
				list = ""

				if (page[0] === undefined) {
					return message.channel.send(mention() + ', no se encontraron artículos con la etiqueta buscada');
				};

				for (var i = 0; i < page.length; i++) {
					queue = page[i]

					response = '**' + queue['title'] + ':** ' +
						queue['site'] + '\\' + queue['name'] + ' (+' +
						queue['adjustedRating'] + ')\n'

					list += response
				}

				const embed = new Discord.RichEmbed()
						.setTitle('Artículos con las etiquetas: ' + args + " (-" + site.toUpperCase() + ")")
						.setDescription(list)
		                .setAuthor(message.author.username, message.author.displayAvatarURL)
		                .setColor(0x588d9b) 

				message.channel.send({ embed });

			});
		} else if (command == "user") {
			args.push('-')
			query = args.slice(0, -1).join("-")
			const user = api.findUsers(query)

			user.then(function(value) {
				boi = value['data']['users'][0]

				if (boi === undefined) { 
					return message.channel.send(mention() + ', el usuario no existe'); 
				};
				response = '**Datos de ' + boi['displayName'] + ':** ' + 'http://www.scpper.com/user/' + boi['id']				
				message.channel.send(response);
			});
		} else if (command == "purga") {
			async function purge() {
				message.delete(); 

				if (!message.member.roles.find("name", "director")) {
					message.channel.send('Necesitas el rol "director" para utilizar este comándo.');
					return; 
				}

				if (isNaN(args[0])) {
					message.channel.send('Por favor, usa un número como argumento. \n Uso: !purga <cantidad>'); //\n means new line.
					return;
				}

				const fetched = await message.channel.fetchMessages({limit: args[0]});
				console.log(fetched.size + ' mensajes encontrados, eliminando...'); 

				message.channel.bulkDelete(fetched)
					.catch(error => message.channel.send(`Error: ${error}`)); // If it finds an error, it posts it into the channel.
			}

		// We want to make sure we call the function whenever the purge command is run.
		purge(); // Make sure this is inside the if(msg.startsWith)

 		} /*else if (ban) kick*/

		message.delete();
		marv();
	}
});

client.login(process.env.token);
