const prompter = require('discordjs-prompter');

module.exports = async (client, message, args) => {
    const user = message.mentions.users.first();
    if (user) {
        const mensaje = args.slice(1).join(" ").split("|");
        var razon = mensaje[0];
        var vigencia = mensaje[1];
        var notas = mensaje[2];
        const member = message.guild.member(user);
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
                message.channel.send(`Debes darme una razón para darle una advertencia esto  (シ. .)シ`);
                return;
            }
            if (!vigencia || vigencia.trim() == "") {//valida que se proporcione la vigencia del baneo
                message.channel.send(`Debes darme la vigencia del ban. "| <vigencia>" `);
                return;
            }

            var confirmar = await confirmacion(message, member.user.username, razon, client);

            if (confirmar) {
                //Se enviará un mensaje privado al usuario justo antes de ser baneado para informarle la razón de su baneo
                await member.send(`Saludos **${member.user.username}** se le informa que ha sido baneado debido a: **${razon}**`);

                member.ban({ reason: razon }).then(() => {
                    message.channel.send(`El usuario **${member.user.username}** fue baneado debido a **${razon}**`);
                    let notify = client.functions.get("NOTIFICA_SANCION");
                    let embed = client.functions.get("EMBED_NOTIFY");
                    notify(client, embed(message, member, "Ban", razon, "010F1E", vigencia, notas));
                }).catch(err => {
                    console.log(err);
                    message.channel.send(`No pude darle ban **${member.user.username}** debido a **${err}**. No me mates  m;_ _)m`);
                })
            } else {
                message.channel.send(`**${message.author}** no confirmaste el baneo, así que no lo haré ┐(‘～\` )┌ `);
                return
            }
        } else {
            message.channel.send("Ese usuario no se encuentra en el server  (￢_￢)");
        }
    } else {
        message.channel.send("No has mencionado a ningún usuario para banear una advertencia (ノ_<。)");
    }
};

const confirmacion = (message, username, razon, client) => {
    return new Promise((resolve, reject) => {
        prompter.message(message.channel, {
            question: `Por favor confirma que deseas banear a **${username}** debido a **${razon}** : `,
            userId: message.author.id,
            max: 1,
            timeout: 60000,
        }).then(responses => {
            if (!responses || !responses.size) {
                return resolve(false);
            }
            const response = responses.first()
            return resolve(client.config.get("ADMIN")["R_AFIRMATIVAS"].includes(response.toString().toLowerCase().trim()));
        })
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