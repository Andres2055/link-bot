const Discord = require("discord.js");

module.exports = async (client, message, args) => {
    var command = args[0].toString().trim().toLowerCase();
    let commandsName = client.commands.get(command);
    let aliasesName = client.commands.get(client.aliases.get(command));
    let commandFile = commandsName || aliasesName;
    if (commandFile) {
        if (commandFile.config.configurable) {
            if (commandFile.config.activo) {
                message.channel.send(`Este comando ya está activo -___-`);
            } else {
                commandFile.config.activo = true;
                message.channel.send(`**${commandFile.config.name}** fue activado owo`);
            }
        } else {
            message.channel.send(`No puedes cambiar la configuración de este comando ¿Qué pretendes? -___-`);
        }
    } else {
        message.channel.send(`Uh, el comando **${command}** no existe wn`);
    }
}

module.exports.config = {
    name: "activar",
    aliases: ["act", "activate"],
    activo: true,
    configurable: false, 
    grupo: "ADMIN"
}