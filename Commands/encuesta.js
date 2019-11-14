const prompter = require('discordjs-prompter');
const regx_emoji = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g

module.exports = async (client, message, args) => {
    //Su puta madre de validaciones
    const mensaje = args.join(" ").split("|");
    var pregunta = mensaje[0];
    var duracion = mensaje[1];
    var opciones = mensaje.slice(2);
    if (!pregunta || pregunta.trim() == "") {
        message.channel.send(`Oye, debes poner una pregunta la encuesta`);
        return;
    }
    if (!duracion || duracion.trim() == "" || isNaN(duracion)) {
        message.channel.send("Oye, debes darme el número de minutos que durará tu votación :tom:");
        return;
    } else if (duracion > 60) {
        message.channel.send("Oye qué te pasa? Las encuestas no pueden durar más de una hora :baia:");
        return;
    }
    if (!opciones || opciones.length < 2) {
        message.channel.send("Tienes que enviar al menos dos opciones para una votación :face_palm:");
        return;
    }
    let emojis = [];
    let validar_opciones = true;
    let map_opciones = new Map();
    opciones.forEach(opcion => {
        if (opcion) {
            op = opcion.split(",");
            if (op.length == 2) {
                if (op[0].match(regx_emoji)) {
                    map_opciones.set(op[0].trim(), op[1]);
                    emojis.push(op[0].trim());
                } else {
                    custom = op[0].split(":");
                    if (custom.length == 3) {
                        custom_emoji = message.guild.emojis.find(emoji =>
                            emoji.name == custom[1].replace(/:/g, ""));
                        if (custom_emoji) {
                            emojis.push(custom_emoji);
                            map_opciones.set(custom_emoji, op[1]);
                        } else {
                            message.channel.send(`${op[0]} no es un emoji, al menos no uno que yo conozca :thonk:`);
                            validar_opciones = false;
                        }
                    } else {
                        message.channel.send(`${op[0]} no es un emoji, al menos no uno que yo conozca :thonk:`);
                        validar_opciones = false;
                    }
                }
            } else {
                validar_opciones = false;
            }
        }
    });

    if (!validar_opciones) {
        message.channel.send("Las opciones que enviaste no son válidas");
        return;
    }
    if (emojis.length < 2) {
        message.channel.send("Tienes que enviar al menos dos opciones para una votación :face_palm:");
        return;
    }

    var question = `**¡Atención! tenemos una nueva encuesta.** ${pregunta}. La encuesta termina en ${duracion} minutos :D`;
    for(let [key, value] of map_opciones.entries()){
        question += `\nVota  ${key}  para  ${value}`;
    }

    prompter.vote(message.channel, {
        question: question,
        choices: emojis,
        timeout: duracion * client.config.get("SCPDIARY_TIME"),
    }
    ).then(response => {
        const winner = response.emojis[0];
        message.channel.send(`**La encuesta ha terminado** y ha ganado ${winner.emoji} para ${map_opciones.get(winner.emoji)}`);
    });

}
module.exports.config = {
    name: "encuesta",
    aliases: ["votacion", "voten", "votar"],
    activo: true,
    configurable: true,
    grupo: "GENERAL",
    contador: 0
}