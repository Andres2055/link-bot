'use strict';
const prompter = require('discordjs-prompter');

module.exports = async (client, message, args) => {
    const user = message.mentions.users.first();
    const mensaje = args.join(" ").split("|");
    var idNameUser = mensaje[0];
    var razon = mensaje[1];
    var vigencia = mensaje[2];
    var notas = mensaje[3];
    var member = null;

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
        if (member.user === message.author) { //valida que no se banear así mismo
            message.channel.send(`Ba-baka, no puedes banearte a tí mismo ${member.user.username}-sempai ヽ('﹏')ノ`);
            return;
        }
        if (member.user.username === client.user.username) { //valida que no intente banear al bot
            message.channel.send(`Con que queriendo darme Banamex alv. Entrále prro :dagger: ٩(╬ʘ益ʘ╬)۶ `);
            return;
        }
        if (!member.bannable) {//valida que el bot tenga permisos para banear al usuario
            message.channel.send(`jejeje Qué crees? No tengo permisos para banear a este vatillo w(ﾟｏﾟ)w`);
            return;
        }
        if (!razon || razon.trim() == "") {//valida que se proporcione una razón para el baneo
            message.channel.send(`Debes darme una razón para banearlo de aquí  (シ. .)シ`);
            return;
        }
        if (!vigencia || vigencia.trim() == "") {//valida que se proporcione la vigencia del baneo
            message.channel.send(`Debes darme la vigencia del ban. "| <vigencia>" `);
            return;
        }

        confirmacion(message, member.user.username, razon, client).then(async confirmar => {
            if (confirmar) {
                //Se enviará un mensaje privado al usuario justo antes de ser baneado para informarle la razón de su baneo
                await member.send(`Saludos **${member.user.username}** se le informa que ha sido baneado debido a: **${razon}**, con vigencia **${vigencia}**`);

                member.ban({ reason: razon }).then(() => {
                    //message.channel.send(`El usuario **${member.user.username}** fue baneado debido a **${razon}**`);
                    let log = client.functions.get("REGISTAR_SANCION");
                    let embed = client.functions.get("EMBED_NOTIFY");
                    log(client, embed(message, member, "Ban", razon, "010F1E", vigencia, notas));
                }).catch(err => {
                    console.log(err);
                    message.channel.send(`No pude darle ban **${member.user.username}** debido a **${err}**. No me mates  m;_ _)m`);
                })
                return;
            } else {
                message.channel.send(`**${message.author}** no me diste una respuesta afirmativa, así que no lo haré ┐(‘～\` )┌ `);
                return;
            }
        }).catch(() => {
            message.channel.send(`**${message.author}** no confirmaste el baneo, así que no lo haré ┐(‘～\` )┌ `);
            return
        })
    } else {
        message.channel.send("Ese usuario no se encuentra en el server  (￢_￢)");
    }

};

var confirmacion = (message, username, razon, client) => {
    return new Promise((resolve, reject) => {
        if (client.config.get("ADMIN").CONFIRMACION_REQUIRED) {
            console.log("Solicitando confirmación");
            let timeout = client.config.get("ADMIN").TIME_OUT_CONFIRMACION * client.config.get("SCPDIARY_TIME");
            console.log("VAmos a generar el promter");
            console.log("timeout", timeout);
            prompter.message(message.channel, {
                question: `Por favor confirma que deseas banear a **${username}** debido a **${razon}** : `,
                userId: message.author.id,
                max: 1,
                timeout: timeout,
            }).then(responses => {
                if (!responses || !responses.size) {
                    console.log("Reject")
                    return reject();

                }
                const response = responses.first();
                console.log("Response", response.toString());
                console.log("Resolve");
                return resolve(client.config.get("ADMIN")["R_AFIRMATIVAS"].includes(response.toString().toLowerCase().trim()));
            }).catch(err => {
                console.log(err);
                return reject(err);
            })
        } else {
            console.log("No se requiere confirmación para baneo");
            resolve(true);
        }
    })
};

module.exports.config = {
    name: "ban",
    aliases: ["banear", "banamex"],
    activo: true,
    configurable: false,
    grupo: "MODERADORES",
    contador: 0
}