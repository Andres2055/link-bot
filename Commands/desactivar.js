const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    var command = args[0].toString().trim();
    let commandsName = client.commands.get(command);
    let aliasesName = client.commands.get(client.aliases.get(command));
    let commandFile = commandsName || aliasesName;
    if (commandFile) {
        if (commandFile.config.configurable) {
            if (!commandFile.config.activo) {
                message.channel.send(`Este comando ya está desactivado -___-`);
            } else {
                commandFile.config.activo = false;
                message.channel.send(`**${commandFile.config.name}** fue desactivado _press F_`);
            }
        } else {
            message.channel.send(`No puedes cambiar la configuración de este comando ¿Qué pretendes? -___-`);
        }
    } else {
        message.channel.send(`Uh, el comando **${command}** no existe wn`);
    }
}

module.exports.config = {
    name: "desactivar",
    aliases: ["dact", "deactivate"],
    activo: true,
    configurable: false,
    grupo: "ADMIN"
}