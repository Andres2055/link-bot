module.exports = async (client, message, args) => {
    const user = message.mentions.users.first();
    const razon = args.slice(1).join(" ");
    if (user) {
        const member = message.guild.member(user);
        if (member) {
            if (member.user === message.author) { //valida que no se kickee así mismo
                message.channel.send(`Ba-baka, no puedes kickearte a tí mismo ${member.user.username}-sempai ヽ('﹏')ノ`);
                return
            }
            if (member.user.username === client.user.username) { //valida que no intente kickear al bot
                message.channel.send(`Con que queriendo mandarme alv. Entrále prro :dagger: ٩(╬ʘ益ʘ╬)۶ `);
                return
            }
            if (!member.kickable) {//valida que el bot tenga permisos para kickear al usuario
                message.channel.send(`jejeje Qué crees? No tengo permisos para kickiar a este vatillo w(ﾟｏﾟ)w`);
                return
            }
            if(razon.trim() === "") { //valida que se haya proporcionado una razón de kickeo
                message.channel.send(`Debes darme una razón para hacerle esto (シ. .)シ`);
                return
            }
            //Se enviará un mensaje privado al usuario justo antes de ser kickeado para informarle la razón de su baneo
            await member.send(`Saludos **${member.user.username}** se le informa que ha sido kickeado debido a: **${razon}**`);
            
            member.kick(razon).then(() => {
                message.channel.send(`El usuario **${member.user.username}** fue kickeado debido a **${razon}**`);
            }).catch(err => {
                console.log(err);
                message.channel.send(`No pude darle kick **${member.user.username}** debido a **${err}**. No me mates :c`);
            })
        } else {
            message.channel.send("Ese usuario no se encuentra en el server ┐(‘～\` )┌ ");
        }
    } else {
        message.channel.send("No has mencionado a ningún usuario para kickear (ノ_<。)");
    }
}


module.exports.config = {
    name: "kick",
    aliases: ["kickear", "patear"],
    activo: true,
    configurable: false,
    grupo: "ADMIN"
}