'use strict'
const Discord = require("discord.js");
let Parser = require('rss-parser');
let htmlToJson = require('html2json').html2json;
let parser = new Parser({
    customFields: {
        item: ['wikidot:authorName', "wikidot:authorUserId"],
    }
});

module.exports.initRSS = async (client, flags, message) => {
    console.log("Inicializando nuevo lector RSS");
    let cnf = {
        "nombre": flags.nombre.toUpperCase(),
        "url": flags.url,
        "interval": flags.interval,
        "channel": flags.channel,
        "channel_name": flags.channel_name,
        "date": new Date(),
        "estatus": "ACTIVO"
    };
    client.config.get("RSS_CONFIGURATIONS").push(cnf);
    let channel = message.guild.channels.find(c => c.name == flags.channel || c.id == flags.channel);
    message.channel.send(`:newspaper: Comenzaré a leer el RSS desde la url **${cnf.url}**, cada **${cnf.interval}** minutos en el canal ${channel}. Para detenerlo usa el nombre **${cnf.nombre}** :D`);
    parser.parseURL(cnf.url).then(feed => {
        console.log(`Publicando ${feed.items.length} mensajes anteriores del Foro`);
        channel.send(titleChannelRSS(feed.title, feed.link));
        feed.items.reverse().forEach(f => {
            channel.send(feedToMessage(f))
        });
        console.log("Se leyeron todos los mensajes del foro");
    }).catch(err => {
        message.channel.send("¡Ay! Lo siento, no pude leer el RSS que me pediste :c");
        console.log(err);
    });
    
    let intObj = client.setInterval(() => {
        let now = new Date();
        now.setMinutes(now.getMinutes() - cnf.interval);
        console.log(`Notificando todos los mensajes del feed cuya hora sea posterior a ${now}`)
        let channel = message.guild.channels.find(c => c.id == cnf.channel);
        parser.parseURL(cnf.url).then(feed => {
            feed.items.filter(f => new Date(f.pubDate) > now).reverse().forEach(f => {
                //console.log("notificando un mensaje");
                channel.send(feedToMessage(f));
            });
        }).catch(err => {
            message.channel.send("¡Ay! Lo siento, no pude leer el RSS que me pediste :otaku_sad:");
            console.log(err);
        });
    }, cnf.interval * client.config.get("SCPDIARY_TIME"));
    client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == cnf.nombre)[0].interval_obj = intObj;
    console.log("Se guardó la nueva configuración del lector RSS")
    //console.log(client.config.get("RSS_CONFIGURATIONS"));
}

module.exports.startRSS = async (client, flags, message) => {
    let cnf = client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == flags.nombre)[0];
    let intObj = client.setInterval(() => {
        let now = new Date();
        now.setMinutes(now.getMinutes() - cnf.interval);
        let channel = message.guild.channels.find(c => c.id == cnf.channel);
        parser.parseURL(cnf.url).then(feed => {
            feed.items.filter(f => new Date(f.pubDate) > now).reverse().forEach(f => {
                channel.send(feedToMessage(f))
            });
        }).catch(err => {
            message.channel.send("¡Ay! Lo siento, no pude leer el RSS que me pediste :otaku_sad:");
            console.log(err);
        });
    }, cnf.interval * client.config.get("SCPDIARY_TIME"));
    client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == cnf.nombre)[0].interval_obj = intObj;
    client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == cnf.nombre)[0].estatus = "ACTIVO";
    message.channel.send(`Se activó el lector RSS ${cnf.nombre} para la url ${cnf.url}`)
    //console.log(client.config.get("RSS_CONFIGURATIONS"));
}

module.exports.stopRSS = async (client, flags, message) => {
    let cnf = client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == flags.nombre)[0];
    client.clearInterval(cnf.interval_obj);
    client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == flags.nombre)[0].interval_obj = "";
    client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == flags.nombre)[0].estatus = "INACTIVO"
    console.log(client.config.get("RSS_CONFIGURATIONS"));
    message.channel.send(`Se desactivó el lector RSS ${cnf.nombre} para la url ${cnf.url}`)
}

module.exports.consultar = async (client, flags, message) => {
    client.config.get("RSS_CONFIGURATIONS").forEach(cnf => {
        //console.log(cnf);
        message.channel.send(configToMessage(cnf));
    });
}

module.exports.updateRSS = async (client, flags, message) => {

}

var configToMessage = (cnf) => {
    const message = new Discord.RichEmbed()
        .setTitle(`Configuración : **${cnf.nombre}**`)
        .setColor("ECCC00")
        .addField("URL del Feed", `**${cnf.url}**`)
        .addField("Intervalo de Lectura", `**${cnf.interval}** minutos`)
        .addField("Canal de publicación", `**${cnf.channel_name}**`)
        .addField("Estatus", `**${cnf.estatus}**`);
    return message;
}

var titleChannelRSS = (title, link) => {
    const titleMessage = new Discord.RichEmbed()
        .setURL(link)
        .setTitle(title)
        .setColor("ECCC00");
    return titleMessage;
}

var feedToMessage = (item) => {
    //console.log(`Nuevo mensaje ${item["content:encoded"].substring(0,50)}`);
    let message = rssToMessage(item["content:encoded"]);
    const post = new Discord.RichEmbed()
        .setURL(`${item.link}`)
        .setTitle(`${item.title && item.title != "" ? item.title : message[2]}`)
        .setAuthor(`Autor: ${item["wikidot:authorName"]}`)
        .setDescription(`:newspaper: \n${message[0]}`)
        .setColor("0E3CDA")
        .setFooter(message[1]);
    return post;
}

var rssToMessage = (content) => {
    let json = htmlToJson(content.trim())
    let json_mensaje = json.child.slice(0, json.child.length - 5)
    let json_pie = json.child.slice(json.child.length - 5, json.child.length)
    let mensaje = ""
    json_mensaje.forEach(m => { mensaje += nodoToString(m) })
    if (mensaje.length > 2000) {
        mensaje = mensaje.substring(0, 2000)
        mensaje += " [...]"
    }
    let pie = ""
    json_pie.forEach(m => { pie += nodoToString(m) })
    let foro_opcional = nodoToString(json_pie[json_pie.length - 1])
    return [mensaje, pie, foro_opcional]
}

var nodoToString = (nodo) => {
    let texto = ""
    if (nodo.text) {
        texto += nodo.text.trimLeft()
    } else if (nodo.tag == "br") {
        texto += "\n"
    } else if (nodo.child && nodo.child.length > 0) {
        nodo.child.forEach(c => { texto += nodoToString(c) })
    }

    if (nodo.tag == "p") { texto += '\n\n' }
    if (nodo.tag == "a") { texto += ' ' }
    if (nodo.tag == "blockquote") { texto = '> ' + texto }
    if (nodo.tag == "strong") { texto = "**" + texto + "** " }
    if (nodo.tag == "em") { texto = "_" + texto + "_ " }
    return decodeHtmlEntities(texto)
}

var decodeHtmlEntities = (string) => {
    return string.replace(/&quot;/g, '\"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        .replace(/&apos;/g, '\'').replace(/&nbsp;/g, ' ').replace(/&#160;/g, " ").replace(/&#8212;/g, "--")
        .replace(/&#8230;/g, "...");
}
