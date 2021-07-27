'use strict'
const Discord = require("discord.js");

//Bloquea el comando según su número de usos y setea un timeout para reactivarlo luego de esto
module.exports.bloqueaComandoSpam = async(commandFile, message, client) => {
    message.channel.send(`Se está abusando del comando **${commandFile.config.name}**. El comando será bloqueado temporalmente`);
    commandFile.config.activo = false;
    client.setTimeout(() => {
        commandFile.config.activo = true;
        commandFile.config.contador = 0;
        const guild = client.guilds.find(guild => guild.name == client.config.get("SERVER").NAME);
        const channel = guild.channels.find(ch => ch.id === client.config.get("SERVER").CHANNEL_LOG);
        channel.send(`El comando **${commandFile.config.name}** ha sido reactivado`);
    }, client.config.get("SCPDIARY_TIME") * client.config.get("COMMMAND_GROUPS")[commandFile.config.grupo].BLOQUEO_TIME_OUT);
};

//Genera un mensaje aleatorio que se enviará mientras esperamos respuesta de scpper
module.exports.msgR = async(message) => { //%10 de que salga
    let msgNum = 1 + Math.floor(Math.random() * 10);
    console.log(msgNum)
    if (msgNum < 5) {
        let msgNum2 = Math.floor(Math.random() * 9);
        let orangutan = Math.floor(Math.random() * 9);

        var theOrangutan = (ora) => {
            return (ora > 1) ? `${orangutanes[ora]} orangután` : `${orangutanes[ora]} orangutanes`
        }

        var orangutanes = [
            "Un", "Nueve", "Ocho", "Siete",
            "Seis", "Cinco", "Cuatro",
            "Tres", "Dos"
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
            '_* lo lame *_'
        ]
        message.channel.send(preSendMsg[msgNum2])
    }
};

//Envía una notificación a los usuarios configurados como desarrolladores
module.exports.notificar = async(error, client) => {
    console.log("Error no controlado: " + error);
    console.log(error.stack); //En caso de un error no controlado, se podrá seguir el origen de este
    //console.trace(); 
    const guild = client.guilds.find(guild => guild.name == client.config.get("SERVER").NAME);
    client.config.get("SERVER").DEVELOPERS.forEach(dev => {
        let developer = guild.members.find(mem => mem.user.username == dev);
        if (developer) { developer.send(`Oye, acaba de pasar algo en el server ${guild.name} revisa mi log. El error es: ${error}`) }
    });
};

//Agrega los intervalos de reinicio de cada uno de los comandos activos
module.exports.agregarIntervalos = (client) => {
    var mapGrupos = new Map(Object.entries(client.config.get("COMMMAND_GROUPS")));
    for (let [key, value] of mapGrupos.entries()) {
        if (value.INTERVAL && !isNaN(value.INTERVAL)) {
            console.log(`Grupo ${key} tendrá un intervalo de reinicio de ${value.INTERVAL} minutos`);
            client.setInterval(() => {
                client.commands.filter(command => command.config.grupo == key).forEach(com => {
                    //console.log(`reseteando contador del comando ${com.config.name}`);
                    if (com.config.activo) {
                        com.config.contador = 0;
                    }
                    //console.log(`contador actual: ${com.config.contador}`);
                });
            }, value.INTERVAL * client.config.get("SCPDIARY_TIME"));
        }
    }
};

//Función que agrega envía un mensaje notificando una nueva ejecución de sanción
module.exports.registrar_sancion = async(client, embed) => {
    const guild = client.guilds.cache.find(guild => guild.name === client.config.get("SERVER").NAME);
    const channel = guild.channels.resolve(client.config.get("SERVER").CHANNEL_LOG);
    if (!channel) return;
    channel.send({ embed });
}

//Función que genera un mensaje Rich Embed para notificar una sanción
module.exports.getRegistroDisciplinario = (message, member, accion, razon, color, vigencia, notas) => {
    const notficacion = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .addField("**ID:**", member.id)
        .addField("**Sujeto**", member.displayName)
        .addField("**Procedimiento**", accion)
        .addField("**Razón:**", razon)
        .addField("**Vigencia:**", vigencia)
        .setColor(color);
    if (notas && notas.trim() != "") {
        notficacion.addField("**Notas:**", notas);
    }
    return notficacion;
};

//Genera un objeto donde el atributo tiene el nombre de la vandera y su valor es el valor de esta bandera
//Ejemplo: la cadena "-b flag b -c another flag" genera el objeto {b: "flag b" , c : "another flag"}
module.exports.process_flags = (flags_str) => {
    let flags = {}
    if (flags_str && flags_str.trim() != "") {
        var arrayFlasgs = flags_str.split(/(\-\-[a-zA-Z]{1,20})/g)
        arrayFlasgs = arrayFlasgs.filter(m => m != "")
        if (arrayFlasgs.length % 2 == 0) {
            for (let i = 0; i < arrayFlasgs.length; i += 2) {
                flags[arrayFlasgs[i].replace("--", "")] = arrayFlasgs[i + 1].trim();
            }
        }
    }
    return flags
}