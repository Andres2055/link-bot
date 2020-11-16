'use strict';

module.exports = async(client, message, args) => {
    message.channel.send("Nice!");
}

module.exports.config = {
    name: "69",
    aliases: ["nice", "69"],
    activo: true,
    configurable: true,
    grupo: "OCIO",
    contador: 0
}