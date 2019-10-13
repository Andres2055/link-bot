const Discord = require("discord.js");

module.exports = async (client, message, args) => {
    var command = args[0].toString().trim().toLowerCase();
    let commandsName = client.commands.get(command);
    let aliasesName = client.commands.get(client.aliases.get(command));
    let commandFile = commandsName || aliasesName;
    if (commandFile) {
        if (commandFile.config.configurable) {
            if (!commandFile.config.activo) {
                message.channel.send(`Este comando ya está desactivado (→_→)`);
            } else {
                commandFile.config.activo = false;
                message.channel.send(`**${commandFile.config.name}** fue desactivado _press F_`);
            }
        } else {
            message.channel.send(`No puedes cambiar la configuración de este comando ¿Qué pretendes? (＃\`Д\´)`);
        }
    } else {
        message.channel.send(`Uh, el comando **${command}** no existe :eyes:`);
    }
}

module.exports.config = {
    name: "desactivar",
    aliases: ["deact", "deactivate"],
    activo: true,
    configurable: false,
    grupo: "ADMIN"
}