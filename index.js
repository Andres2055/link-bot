'use strict'

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const config_json = new Map(Object.entries(require("./Storage/config.json")));
const config_var = require("./Storage/config.json");
const rss = require("./Functions/rss.js");
const commands = JSON.parse(fs.readFileSync('./Storage/commands_help.json'), 'utf8').comandos;

/* Environment Variables */
const PREFIX = config_var['PREFIX'] || process.env.PREFIX
const TOKEN = config_var['TOKEN'] || process.env.TOKEN
const SCPDIARY_TIME = config_var["SCPDIARY_TIME"] || 60000
const FLICKR_SECRET = process.env.FLICKR_SECRET;
const FLICKR_TOKEN = process.env.FLICKR_TOKEN;
const KEY_YOUTUBE = process.env.KEY_YOUTUBE;

client.commands = new Discord.Collection(); //Guarda una colección con los comandos disponibles para el bot
client.aliases = new Discord.Collection(); //Guarda una colección con los comandos disponibles para el bot accesibles mediante el alias
client.config = new Discord.Collection(); //Guarda una colección con las configuraciones tomadas del jsonConfig para su acceso global
client.functions = new Discord.Collection(); //Guarda una coleción con funciones de utilidad que pueden ser usadas por cualquier comando
client.cache_message = []; //Guarda una caché limitado de mensajes para la validación del spam
client.warned_users = [];
client.command_help = commands;
//const sanciones = new Discord.Collection();
//client.registros = new Discord.Collection(); //Guarda una colección de los registros auditables de acciones


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
    client.command_help.forEach(c => {
        let comando = client.commands.get(c.name);
        c.alias = comando.config.aliases;
        c.group = comando.config.grupo;
    });
    console.log(`¡Alias y grupo para "!help" agregados!`)

    for (let [key, value] of config_json.entries()) {
        console.log(`¡Configuración para ${key} cargada!`)
        client.config.set(key, value);
    }
    console.log("¡Settings setteadas!");
    if (FLICKR_SECRET && FLICKR_SECRET) {
        client.config.set("FLICKR_SECRET", FLICKR_SECRET);
        client.config.set("FLICKR_TOKEN", FLICKR_TOKEN);
        console.log("Configuraciones para flickr seteadas");
    } else {
        console.log("No se encontraron las configuraciones para Flicrk, el comando no puede ser usado");
    }
    if (KEY_YOUTUBE) {
        client.config.set("KEY_YOUTUBE", KEY_YOUTUBE);
        console.log("Configuración para el Api Youtube Lista");
    } else {
        console.log("No se encontró el token del Api de Google-Youtube");
    }
    //sanciones.set("ADVERTENCIA", []);
    //sanciones.set("KICK", []);
    //sanciones.set("BANEO", []);
    const internal_function = require("./Functions/internal.js");
    const validaciones = require("./Functions/validacion.js");
    client.functions.set("INFORMAR_ERROR", internal_function.notificar); //Función que notifica de un error a los desarrolladores
    client.functions.set("BLOQUEO_COMANDO", internal_function.bloqueaComandoSpam); //Función que bloquea comandos que han sido spameados
    client.functions.set("MSN_R", internal_function.msgR); //Función que genera un mensaje aleatorio de espera
    client.functions.set("REGISTAR_SANCION", internal_function.registrar_sancion); //Función que registra la sanción en el canal de registro disciplinario
    client.functions.set("EMBED_NOTIFY", internal_function.getRegistroDisciplinario); //Función que genera el mensaje que irá al canal de registro disciplinario
    client.functions.set("SPAM", validaciones.validarSpam); //Función que valida si el mensaje entrante está clasificado como spam
    client.functions.set("HANDLE_SPAM", validaciones.handleSpam); //Función que procesa los mensajes marcados como spam
    client.functions.set("FLAGS", internal_function.process_flags); //Función que procesa las banderas enviadas en un comando
    client.functions.set("INIT_RSS", rss.initRSS);
    client.functions.set("START_RSS", rss.startRSS);
    client.functions.set("STOP_RSS", rss.stopRSS);
    client.functions.set("ALL_RSS", rss.consultar);
    client.functions.set("UPDATE_RSS", rss.updateRSS);
    //Estos registros serán usados más adelante
    //client.registros.set("SANCION", sanciones);
    //client.registros.set("CONFIGURACION", []);
    //client.registros.set("ADVERTENCIAABUSO_COMANDO", []);
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
        "!help, ¡HELP! ¡HELP ME!"
    ];

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

    rss.startAllRss(client);
    const guild = client.guilds.find(guild => guild.name === "Sitio 34-Z:  (No) Iremos a Japón");
    console.log(guild.memberCount);
    console.log(guild.name);
    client.guilds.forEach((value, key) => {
        console.log(value.name);
    })

    let merlin = guild.members.find(mem => mem.id == "324174158063992832");
    if (merlin) {
        merlin.send("Hi, Heroku acaba de reiniciarme, revisa lo que debas revisar");
    } else {
        console.log("No te encontré Merlin :c");
    }

});


client.on('messageDelete', message => {
    try {
        if (message.content.startsWith(";;") || message.channel.type === "dm") { return }
        if (message.guild.name !== client.config.get("SERVER").NAME) { return }
        console.log("Alguien ha eliminado un mensaje, procediendo a registrar a la bitácora");
        const guild = client.guilds.find(guild => guild.name === client.config.get("SERVER").NAME);
        const channel = guild.channels.find(ch => ch.id === client.config.get("SERVER").CHANNEL_DELETED_MESSAGES);
        console.log("Se supone que deberíamos poder saber quién fue el autor, pero como puto discord se puso mamón, pues alv");
        console.log(message.author.username);
        const mensajeBorrado = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .setTitle("Mensaje borrado")
            .setColor("#ff0037")
            .addField("**Mensaje**", message.content)
            .addField("**Fecha de publicado** (UTC): ", new String(new Date(message.createdTimestamp)))
            .addField("**Canal**", message.channel, false);
        channel.send(mensajeBorrado);
    } catch (err) {
        console.log("La puta madre, eso me gano por querer registrar los mensajes borrados");
        console.log(err);
    }
});

client.on('messageDeleteBulk', () => {
    console.log("Acabo de borrar muchos mensajes");
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    try {
        if (oldMessage.channel.id == client.config.get("SERVER").CHANNEL_WELCOME && oldMessage.content && newMessage.content) {
            console.log("Alguien ha editado su mensaje en el #lobby, registrando en la bitácora");
            const guild = client.guilds.find(guild => guild.name === client.config.get("SERVER").NAME);
            const channel = guild.channels.find(ch => ch.id === client.config.get("SERVER").CHANNEL_DELETED_MESSAGES);
            const registrar = new Discord.RichEmbed()
                .setAuthor(oldMessage.author.username, oldMessage.author.displayAvatarURL)
                .setColor("#ffee00")
                .setTitle("Mensaje Editado en Lobby ")
                .addField("**Mensaje Previo**", oldMessage.content)
                .addField("**Mensaje Nuevo**", newMessage.content);
            channel.send(registrar);
        }
    } catch (err) {
        console.log("Pinches mensajes actualizado, creo que no dan tanto pedo");
        console.log(err);
    }
})

client.on('guildMemberAdd', member => {
    try {
        console.log("Se supone que acaba de entrar un nuevo wacho, pero no sé si pueda notificarlo :sad_marw:");
        console.log(member);
        member.send(`Hola, Mi nombre es Estiben y soy el bot del sitio-34, puedes ver mis comandos tecleando !h !help o !ayuda aquí o en el server
	Te doy la bienvenida a nuestra comunidad y algunas recomendaciones:
	Lee el canal #reglas-leer-primero es importante que lo hagas
	Evita el spam
	No tenemos nada qué ver con el videojuego ni tampoco canales de youtube
	Recuerda que nuestro staff son los usuarios
	-Merlin-VI#1443 (Administrador)
	-Dc_Yerko#7804 (Administrador)
	-Luis Gm#9398 (Moderador)
	-Shadow-MASK#6421 (Veterano)
	-Abbsy#5905 (Mod Junior)
	-Agente Shuffle (Mod Junior)
	
	Evita usar las menciones (@alguien) con el staff si no es un tema urgente
	Recuerda que **no puedes pedir ayuda** con el cuestionario de ingreso
	Si notas que te llegan mensajes con spam de otros servidores comunícalo al staff`);

        const channel = member.guild.channels.find(ch => ch.id === client.config.get("SERVER").CHANNEL_WELCOME);
        if (!channel) return;
        channel.send(`¡Heya ${member.user}! Ten un... supongo... un, ¡si! ¡Una buena charla! Recuerda mirar #reglas-leer-primero antes de si quiera pensar escribir un emoji. Digo, ¡SI!`);
    } catch (err) {
        console.log("La putamadre Estiben, porqué no puedes notificar los nuevos miembros?");
        console.log(err);
    }
});

client.on('guildMemberRemove', member => {
    try {
        const channel = member.guild.channels.find(ch => ch.id === client.config.get("SERVER").CHANNEL_FARAWELL);
        if (!channel) return;
        channel.send(`¡Adios, **${member.user.username}**! Espero que vuelvas pronto :D`);
    } catch (err) {
        console.log("Error al procesar Miembro removido ekisde");
        console.log(err);
    }

});

client.on('guildBanAdd', (guild, user) => {
    try {
        const channel = guild.channels.find(ch => ch.id === client.config.get("SERVER").CHANNEL_FARAWELL);
        if (!channel) return;
        channel.send(`${user.tag} ha sido baneado`);
    } catch (err) {
        console.log("Error al banear a alguien");
        console.log(err);
    }
});

client.on("message", message => {

    var validarPermisos = (message, comando) => {
        let v = false;
        //Si el comando es del grupo General, entonces no es necesario validar roles
        //Si se está usando por mp, el comando validará que solo puedan usarse los comandos configurados para ello
        if (client.config.get("SERVER").GENERAL_GROUP.includes(comando.config.grupo) && message.channel.type === "dm") {
            return comando.config.mp
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
            /*let spam = client.functions.get("SPAM");
            let response = spam(client, message);
            if (response.length) {
            	let handle = client.functions.get("HANDLE_SPAM");
            	handle(client, response, message);
            	return;
            }*/
            if (message.content.toLowerCase.includes("sesenta\ y\ nueve") || message.content.toLowerCase.includes("ES-169") || message.content.match(/( 69|69 )/g) || (message.content === '69')) { message.channel.send("Nice").catch(() => { console.log("No Nice") }) }
            if (!message.content.startsWith(PREFIX)) return;
            let messageArray = message.content.split(/ +/g);
            let cmd = messageArray[0].toLowerCase().slice(PREFIX.length);
            let args = messageArray.slice(1)

            let commandsName = client.commands.get(cmd);
            let aliasesName = client.commands.get(client.aliases.get(cmd));
            let commandFile = commandsName || aliasesName;
            if (commandFile) {
                if (commandFile.config.activo) {
                    /*let numero_usos = client.config.get("COMMMAND_GROUPS")[commandFile.config.grupo].NUM_USOS;
                    if (client.config.get("COMMMAND_GROUPS")[commandFile.config.grupo].NUM_USOS) {
                    	//console.log(`El comando ${commandFile.config.name} se ha usado ${commandFile.config.contador} veces. Puede usarse sólo ${client.config.get("COMMMAND_GROUPS")[commandFile.config.grupo].NUM_USOS} veces`);
                    }
                    /*if (numero_usos && commandFile.config.contador >= Math.floor(numero_usos * 0.80)) {
                    	message.channel.send(`Advertencia: El comando ${commandFile.config.name} se está usando demasiado y podría bloquearse`);
                    }
                    if (numero_usos && commandFile.config.contador >= numero_usos) {
                    	let bloqueaComandoSpam = client.functions.get("BLOQUEO_COMANDO");
                    	bloqueaComandoSpam(commandFile, message, client);
                    	return
                    }*/
                    if (!validarPermisos(message, commandFile)) {
                        message.channel.send(`Lo siento ${message.author} pero no tienes permiso para usar este comando`);
                        return
                    }
                    if (commandFile.config.grupo == 'SCP') {
                        let msgR = client.functions.get("MSN_R");
                        msgR(message);
                    }
                    commandFile.config.contador += 1;
                    try {
                        commandFile(client, message, args);
                    } catch (err) {
                        console.log("Ocurrió pinches un error alv");
                        console.log(err);
                    }

                } else {
                    message.channel.send(`Ese comando ha sido desactivado. F`);
                }
            } else {
                message.channel.send(`Uh, ese no es un comando válido. Revisa los comandos con ${PREFIX}help.`);
            }
        } catch (error) {
            let notify = client.functions.get("INFORMAR_ERROR");
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