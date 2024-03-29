'use strict';
const prompter = require('discordjs-prompter');

module.exports = async (client, message, args) => {
    // const user = message.mentions.users.first();
    const mensaje = args.join(" ").split("|");
    var idNameUser = mensaje[0];
    var razon = mensaje[1];
    var vigencia = mensaje[2];
    var notas = mensaje[3];
    const members = await message.guild.members.fetch({ query: idNameUser.trim() });
    var member = members.first();

    /* if (user) {
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
    } */

    if (member) {
        if (member.user === message.author) { //valida que no se banear así mismo
            message.channel.send(`Ba-baka, no puedes banearte a tí mismo ${member.displayName}-sempai ヽ('﹏')ノ`);
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
        if (!razon) {//valida que se proporcione una razón para el baneo
            message.channel.send(`Debes darme una razón para banearlo de aquí  (シ. .)シ`);
            return;
        }
        if (!vigencia || vigencia.trim() == "") {//valida que se proporcione la vigencia del baneo
            message.channel.send(`Debes darme la vigencia del ban. "| <vigencia>" `);
            return;
        }

        confirmacion(message, member.user.username, razon, client).then(async confirmar => {
            console.log("confirmacion: ",confirmar);
            if (confirmar) {
                //Se enviará un mensaje privado al usuario justo antes de ser baneado para informarle la razón de su baneo
                try {
                     await member.send(`Saludos **${member.displayName}** se le informa que ha sido baneado debido a: **${razon}**, con vigencia **${vigencia}**`);
                }catch(err){
                     message.channel.send("Alguien avisele al morro mamon, porque yo no pude :(");
                }
                member.ban({ reason: razon }).then(() => {
                    //message.channel.send(`El usuario **${member.user.username}** fue baneado debido a **${razon}**`);
                    let log = client.functions.get("REGISTAR_SANCION");
                    let embed = client.functions.get("EMBED_NOTIFY");
                    log(client, embed(message, member, "Ban", razon, "010F1E", vigencia, notas));
                }).catch(err => {
                    console.log(err);
                    message.channel.send(`No pude darle ban **${member.displayName}** debido a **${err}**. No me mates  m;_ _)m`);
                })
                return;
            } else {
                message.channel.send(`**${message.author}** no me diste una respuesta afirmativa, así que no lo haré ┐(‘～\` )┌ `);
                return;
            }
        }).catch((err) => {
            console.log("error al confirmar");
            console.log(err);
            message.channel.send(`**${message.author}** no confirmaste el baneo, así que no lo haré ┐(‘～\` )┌ `);
            return
        })
    } else {
        message.channel.send("Ese usuario no se encuentra en el server  (￢_￢)");
    }

};

var confirmacion = (message, username, razon, client) => {
    return new Promise((resolve) => {
        resolve(true);
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
