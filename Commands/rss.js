'use strict';
const Discord = require("discord.js");

module.exports = async (client, message, args) => {
    const commands = {
        INIT: client.functions.get("INIT_RSS"),
        START: client.functions.get("START_RSS"),
        STOP: client.functions.get("STOP_RSS"),
        ALL: client.functions.get("ALL_RSS"),
        UPDATE: client.functions.get("UPDATE_RSS")
    };
    let command_name = args[0].toUpperCase();
    let flstr = args.slice(1).join(" ");
    let command = commands[command_name]
    if (command) {
        let flags = client.functions.get("FLAGS")(flstr);
        //console.log(flags)
        if (validateFlags(flags, command_name, client, message)) {
            command(client, flags, message);
        }
    } else {
        message.channel.send(`Lo siento, pero **${command_name}** no coincide con niguna instrucción para el comando RSS`)
    }
};




var validateFlags = (flag, command_name, client, message) => {
    if (Object.entries(flag).length > 0) {
        switch (command_name) {
            case "INIT":
                return validarInit(flag, message, client);
            case "START":
                return validarStart(flag, message, client);
            case "STOP":
                return validarStop(flag, message, client);
            case "UPDATE":
                return validarUpdate(flag, message, client);
        }
        return true;
    } else if (command_name == "ALL") {
        return true;
    } else {
        message.channel.send(`Lo siento, pero los parámetros no son válidos para ejecutar la función ${command_name}`)
        return false;
    }
};

var validarUpdate = (flags, message, client) => {
    if (!flags.nombre || flags.nombre.trim() == "") {
        if (!flags.n || flags.n.trim() == "") {
            message.channel.send("No se ha enviado el nombre de la configuración RSS para actualizar");
            return false;
        } else {
            flags.nombre = flags.n;
        }
    }
    flags.nombre = flags.nombre.toUpperCase();

    
}

var validarStart = (flags, message, client) => {
    if (!flags.nombre || flags.nombre.trim() == "") {
        if (!flags.n || flags.n.trim() == "") {
            message.channel.send("No se ha enviado el nombre de la configuración RSS a iniciar");
            return false;
        } else {
            flags.nombre = flags.n;
        }
    }
    flags.nombre = flags.nombre.toUpperCase();
    let rss_config = client.config.get("RSS_CONFIGURATIONS").filter(cnf => cnf.nombre == flags.nombre).length;
    if (rss_config) {
        if (rss_config.estatus == "ACTIVO") {
            message.channel.send(`El lector RSS ${flags.nombre} ya está activo`);
            return false;
        }
    } else {
        message.channel.send(`No existe una configuración con el nombre ${flags.nombre}`)
        return false;
    }
    return true;
};

var validarStop = (flags, message, client) => {
    if (!flags.nombre || flags.nombre.trim() == "") {
        if (!flags.n || flags.n.trim() == "") {
            message.channel.send("No se ha enviado el nombre de la configuración RSS a detener");
            return false;
        } else {
            flags.nombre = flags.n;
        }
    }
    flags.nombre = flags.nombre.toUpperCase();
    let rss_config = client.config.get("RSS_CONFIGURATIONS").filter(cnf => cnf.nombre == flags.nombre).length;
    if (rss_config) {
        if (rss_config.estatus == "INACTIVO") {
            message.channel.send(`El lector RSS ${flags.nombre} ya está inactivo`);
            return false;
        }
    } else {
        message.channel.send(`No existe una configuración con el nombre ${flags.nombre}`)
        return false;
    }
    return true;
};

var validarInit = (flags, message, client) => {
    if (!flags.nombre || flags.nombre.trim() == "") {
        if (!flags.n || flags.n.trim() == "") {
            message.channel.send("No se ha enviado el nombre que se asignará a esta configuración RSS");
            return false;
        } else {
            flags.nombre = flags.n;
        }
    }
    flags.nombre = flags.nombre.toUpperCase();
    if (!flags.url || flags.url.trim() == "") {
        if (!flags.u || flags.u.trim() == "") {
            message.channel.send("No se ha enviado la url de donde se leerá el RSS");
            return false;
        } else {
            flags.url = flags.u;
        }
    }
    let rss_config = client.config.get("RSS_CONFIGURATIONS").filter(cnf => cnf.nombre == flags.nombre && cnf.url == flags.url).length;
    if (rss_config) {
        message.channel.send(`Ya existe una configuración RSS para el nombre ${flags.nombre}, leyendo la url ${flags.url}`);
        return false
    }

    if (!flags.interval || flags.interval.trim() == "") {
        if (!flags.i || flags.i.trim() == "") {
            message.channel.send("No se ha el intervalo de lectura del RSS");
            return false;
        } else {
            flags.interval = flags.i;
            let interval = parseInt(flags.interval);
            if (interval > 0 && interval <= 1440) {
                flags.interval = interval;
            } else {
                message.channel.send(`El intervalo de lectura en minutos debe ser de mínimo 1 y máximo 1440 (24 horas)`);
                return false;
            }
        }
    }

    if (!flags.channel || flags.channel.trim() == "") {
        if (!flags.c || flags.c.trim() == "") {
            message.channel.send("No se ha enviado el canal donde se enviarán los mensjaes del RSS");
            return false;
        } else {
            flags.channel = flags.c;
        }
    }

    let channel = message.guild.channels.find(c => c.name == flags.channel || c.id == flags.channel);
    if (channel) {
        flags.channel = channel.id;
        flags.channel_name = channel.name
    } else {
        message.channel.send(`No se ha encontrado el canal ${flags.channel}`);
        return false;
    }
    return true;
};

module.exports.config = {
    name: "rss",
    aliases: ["feed", "read_rss"],
    activo: true,
    configurable: false,
    grupo: "ADMIN",
    contador: 0
};