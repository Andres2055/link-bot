'use strict';
module.exports = async(client, message, args) => {

    const mensaje = args.join(" ").split("|");
    var idNameUser = mensaje[0];
    var razon = mensaje[1];
    var vigencia = mensaje[2];
    var notas = mensaje[3];

    const members = await message.guild.members.fetch({ query: idNameUser.trim() });
    var member = members.first();


    if (member) {
        if (member.user === message.author) { //valida que no se kickee así mismo
            message.channel.send(`Ba-baka, no puedes kickearte a tí mismo ${member.user.username}-sempai ヽ('﹏')ノ`);
            return
        }
        if (member.user.username === client.user.username) { //valida que no intente kickear al bot
            message.channel.send(`Con que queriendo mandarme alv. Entrále prro :dagger: ٩(╬ʘ益ʘ╬)۶ `);
            return
        }
        if (!member.kickable) { //valida que el bot tenga permisos para kickear al usuario
            message.channel.send(`jejeje Qué crees? No tengo permisos para kickiar a este vatillo w(ﾟｏﾟ)w`);
            return
        }
        if (!razon) { //valida que se haya proporcionado una razón de kickeo
            message.channel.send(`Debes darme una razón para expulsarlo un ratico (シ. .)シ`);
            return
        }
        if (!vigencia || vigencia.trim() == "") { //valida que se proporcione la vigencia del baneo
            message.channel.send(`Debes darme la vigencia del Kick. "| <vigencia>" `);
            return;
        }
        //Se enviará un mensaje privado al usuario justo antes de ser kickeado para informarle la razón de su baneo
        await member.send(`Saludos **${member.displayName}** se le informa que ha sido kickeado debido a: **${razon}**, con vigencia **${vigencia}**`);

        member.kick(razon).then(() => {
            //message.channel.send(`El usuario **${member.user.username}** fue kickeado debido a **${razon}**`);
            let log = client.functions.get("REGISTAR_SANCION");
            let embed = client.functions.get("EMBED_NOTIFY");
            log(client, embed(message, member, "Kick", razon, "DFE51B", vigencia, notas));
        }).catch(err => {
            console.log(err);
            message.channel.send(`No pude darle kick **${member.user.username}** debido a **${err}**. No me mates :c`);
        })

    } else {
        message.channel.send("No has mencionado a ningún usuario para kickear (ノ_<。)");
    }
}


module.exports.config = {
    name: "kick",
    aliases: ["kickear", "patear"],
    activo: true,
    configurable: false,
    grupo: "JR_STAFF",
    contador: 0
}