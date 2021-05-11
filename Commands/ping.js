'use strict';

module.exports = async (client, message, args) => {
    message.channel.send("La Ley requiere que diga PONG. Aquí ando, no se espanten");
}

module.exports.config = {
    name: "ping",
    aliases: ["estatus",],
    activo: true,
    configurable: true,
    grupo: "GENERAL",
    contador: 0
}