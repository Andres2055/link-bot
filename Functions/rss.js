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
    let cnf = {
        "nombre": flags.nombre,
        "url": flags.url,
        "interval": flags.interval,
        "channel": flags.channel,
        "date": new Date(),
        "estatus": "ACTIVO"
    };
    client.config.get("RSS_CONFIGURATIONS").push(cnf);
    let channel = message.guild.channels.find(c => c.name == flags.channel || c.id == flags.channel);
    message.channel.send(`:newspaper: Comenzaré a leer el RSS desde la url **${cnf.url}**, cada **${cnf.interval}** minutos en el canal ${channel}. Para detenerlo usa el nombre **${cnf.nombre}** :D`);
    await parser.parseURL(cnf.url).then(feed => {
        channel.send(titleChannelRSS(feed.title, feed.link));
        feed.items.reverse().slice(feed.items.length - 15).forEach(f => {
            channel.send(feedToMessage(f))
        })
    }).catch(err => {
        message.channel.send("¡Ay! Lo siento, no pude leer el RSS que me pediste :c");
        console.log(err);
    });

}

module.exports.startRSS = () => {

}

module.exports.stopRSS = () => {

}
var titleChannelRSS = (title, link) => {
    const titleMessage = new Discord.RichEmbed()
        .setURL(link)
        .setTitle(title)
        .setColor("ECCC00");
    return titleMessage;
}

var feedToMessage = (item) => {
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
        mensaje += "[...]"
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
    if (nodo.tag == "strong") { texto = "**" + texto + "**" }
    if (nodo.tag == "em") { texto = "_" + texto + "_" }
    return decodeHtmlEntities(texto)
}

var decodeHtmlEntities = (string) => {
    return string.replace(/&quot;/g, '\"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        .replace(/&apos;/g, '\'').replace(/&nbsp;/g, ' ').replace(/&#160;/g, " ").replace(/&#8212;/g, "--");
}
