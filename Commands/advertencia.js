'use strict';

module.exports = async (client, message, args) => {
    const rol = client.commands.get("rol");
    if (rol && rol.config.activo) {
        const user = message.mentions.users.first();
        let mensaje = args.join(" ").split("|");
        let idNameUser = mensaje[0];
        let razon = mensaje[1];
        let vigencia = mensaje[2];
        let notas = mensaje[3];
        var member = null;

        if (!razon || razon.trim() == "") {
            message.channel.send(`Debes darme una razón para darle una advertencia  (シ. .)シ`);
            return;
        }
        if (!vigencia || vigencia.trim() == "") {
            message.channel.send(`Debes darme la vigencia de la advertencia. "| <vigencia>" `);
            return;
        }
        if (user) {
            member = message.guild.member(user);
        } else if (idNameUser) {
            if (isNaN(idNameUser)) {
                console.log("Buscar por nombre/nickname ", idNameUser);
                idNameUser = idNameUser.toUpperCase().trim();
                member = message.guild.members.find(m => (m.nickname && m.nickname.toUpperCase().trim() == idNameUser) || (m.user.username.toUpperCase().trim() == idNameUser));
            } else {
                console.log("Buscar por id usuario ", idNameUser);
                member = message.guild.members.find(m => m.id == idNameUser);
            }
        }
        if (member) {
            let userId = member.user.id;
            let advL1 = member.roles.find(rol => rol.name.toLowerCase() == client.config.get("SERVER")["ROL_ADVERTENCIA_L1"].toLowerCase());
            if (advL1) {
                //Si tiene advertencia entonces debemos retirarla y agregar una advertencia nivel 2
                let advL2 = member.roles.find(rol => rol.name.toLowerCase() == client.config.get("SERVER")["ROL_ADVERTENCIA_L2"].toLowerCase());
                if (advL2) {
                    //Si ya tiene toca poner mute
                    let mute = member.roles.find(rol => rol.name.toLowerCase() == client.config.get("SERVER")["MUTED"].toLowerCase());
                    if (mute) {
                        message.channel.send(`El usuario ${member.nickname ? member.nickname : member.user.username} ya tiene un mute, hay que tomar otras sanciones  (╬ Ò﹏Ó)`);
                        return;
                    } else {
                        await member.send(`Saludos **${member.user.username}** se le informa que ha sido sancionado con un Mute debido a: **${razon}**, con vigencia **${vigencia}**`);
                        rol(client, message, getMessage(args, client.config.get("SERVER")["MUTED"], userId));
                        let log = client.functions.get("REGISTAR_SANCION");
                        let embed = client.functions.get("EMBED_NOTIFY");
                        log(client, embed(message, member, "Muteo", razon, "49130B", vigencia, notas));
                    }
                } else {
                    await member.send(`Saludos **${member.user.username}** se le informa que ha sido sancionado con una Advertencia Nivel 2 debido a: **${razon}**, con vigencia **${vigencia}**`);
                    rol(client, message, getMessage(args, client.config.get("SERVER")["ROL_ADVERTENCIA_L2"], userId));
                    let log = client.functions.get("REGISTAR_SANCION");
                    let embed = client.functions.get("EMBED_NOTIFY");
                    log(client, embed(message, member, "Advertencia Nivel 2", razon, "F42E0E", vigencia, notas));
                }
            } else {
                await member.send(`Saludos **${member.user.username}** se le informa que ha sido sancionado con una Advertencia Nivel 1 debido a: **${razon}**, con vigencia **${vigencia}**`);
                rol(client, message, getMessage(args, client.config.get("SERVER")["ROL_ADVERTENCIA_L1"], userId));
                let log = client.functions.get("REGISTAR_SANCION");
                let embed = client.functions.get("EMBED_NOTIFY");
                log(client, embed(message, member, "Advertencia Nivel 1", razon, "F07A18", vigencia, notas));
            }
        } else {
            message.channel.send("No has mencionado a un usuario que se encuentre en el server  (￢_￢)");
        }

    } else {
        message.channel.send("Lo siento, no encontré los comandos de rol, por favor revisa que estén activos (*μ_μ)")
    }
};

var getMessage = (args, adv, userId) => {
    let mensaje = [args[0], adv, "|", args.slice(1).join(" "), "|", userId];
    return mensaje;
};

module.exports.config = {
    name: "advertencia",
    aliases: ["adv", "warn"],
    activo: true,
    configurable: false,
    grupo: "JR_STAFF",
    contador: 0
}