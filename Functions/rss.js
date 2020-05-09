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
        "type": flags.type,
        "date": new Date(),
        "activo": true
    };
    client.config.get("RSS_CONFIGURATIONS").push(cnf);
    let channel = message.guild.channels.find(c => c.name == flags.channel || c.id == flags.channel);
    message.channel.send(`:newspaper: Comenzaré a leer el RSS desde la url **${cnf.url}**, cada **${cnf.interval}** minutos en el canal ${channel}. Para detenerlo usa el nombre **${cnf.nombre}** :D`);
    parser.parseURL(cnf.url).then(feed => {
        console.log(`Publicando ${feed.items.length} mensajes anteriores del Foro`);
        channel.send(titleChannelRSS(feed.title, feed.link));
        feed.items.reverse().forEach(f => {
            channel.send(feedToMessage(f, cnf.type));
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
                channel.send(feedToMessage(f, cnf.type));
            });
        }).catch(err => {
            message.channel.send("¡Ay! Lo siento, no pude leer el RSS que me pediste :otaku_sad:");
            console.log(err);
        });
    }, cnf.interval * client.config.get("SCPDIARY_TIME"));
    client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == cnf.nombre)[0].interval_obj = intObj;
    console.log("Se guardó la nueva configuración del lector RSS")
    console.log(client.config.get("RSS_CONFIGURATIONS"));
}

module.exports.startRSS = async (client, flags, message) => {
    let cnf = client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == flags.nombre)[0];
    let intObj = client.setInterval(() => {
        let now = new Date();
        now.setMinutes(now.getMinutes() - cnf.interval);
        console.log(`Notificando todos los mensajes del feed cuya hora sea posterior a ${now}`)
        let channel = message.guild.channels.find(c => c.id == cnf.channel);
        parser.parseURL(cnf.url).then(feed => {
            feed.items.filter(f => new Date(f.pubDate) > now).reverse().forEach(f => {
                channel.send(feedToMessage(f, cnf.type))
            });
        }).catch(err => {
            message.channel.send("¡Ay! Lo siento, no pude leer el RSS que me pediste :otaku_sad:");
            console.log(err);
        });
    }, cnf.interval * client.config.get("SCPDIARY_TIME"));
    client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == cnf.nombre)[0].interval_obj = intObj;
    client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == cnf.nombre)[0].activo = true;
    message.channel.send(`Se activó el lector RSS ${cnf.nombre} para la url ${cnf.url}`)
    console.log(client.config.get("RSS_CONFIGURATIONS"));
}

module.exports.stopRSS = async (client, flags, message) => {
    let cnf = client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == flags.nombre)[0];
    client.clearInterval(cnf.interval_obj);
    client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == flags.nombre)[0].interval_obj = "";
    client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == flags.nombre)[0].activo = false;
    console.log(client.config.get("RSS_CONFIGURATIONS"));
    message.channel.send(`Se desactivó el lector RSS ${cnf.nombre} para la url ${cnf.url}`)
}

module.exports.consultar = async (client, flags, message) => {
    client.config.get("RSS_CONFIGURATIONS").forEach(cnf => {
        console.log(cnf);
        message.channel.send(configToMessage(cnf));
    });
}

module.exports.updateRSS = async (client, flags, message) => {

}

module.exports.stratAllRss = async (client) => {
    console.log("Inciando los intervalos de lectura RSS")
    client.config.get("RSS_CONFIGURATIONS").forEach(cnf => {
        if (cnf.activo) {
            let intObj = client.setInterval(() => {
                let now = new Date();
                now.setMinutes(now.getMinutes() - cnf.interval);
                console.log(`Notificando todos los mensajes del feed cuya hora sea posterior a ${now} de la configuración ${cnf.nombre}` );

                const guild = client.guilds.find(guild => guild.name == client.config.get("SERVER").NAME);
                const channel = guild.channels.find(ch => ch.id == cnf.channel);

                parser.parseURL(cnf.url).then(feed => {
                    feed.items.filter(f => new Date(f.pubDate) > now).reverse().forEach(f => {
                        channel.send(feedToMessage(f, cnf.type))
                    });
                }).catch(err => {
                    console.log("¡Ay! Lo siento, no pude leer el RSS que me pediste :otaku_sad:");
                    console.log(err);
                });
            }, cnf.interval * client.config.get("SCPDIARY_TIME"));

            client.config.get("RSS_CONFIGURATIONS").filter(c => c.nombre == cnf.nombre)[0].interval_obj = intObj;
            console.log(`Se activó el lector RSS ${cnf.nombre} para la url ${cnf.url} en el canal ${cnf.channel_name}`)
        }
    });
    console.log("Se han activado todas las configuraciones RSS");
}

var configToMessage = (cnf) => {
    const message = new Discord.RichEmbed()
        .setTitle(`Configuración: **${cnf.nombre}**`)
        .setColor("ECCC00")
        .addField("URL del Feed", `**${cnf.url}**`)
        .addField("Intervalo de Lectura", `**${cnf.interval}** minutos`)
        .addField("Canal de publicación", `**${cnf.channel_name}**`)
        .addField("Estatus", `**${cnf.activo ? "Activo" : "Inactivo"}**`)
        .addField("Tipo", `**${cnf.type}**`);
    return message;
}

var titleChannelRSS = (title, link) => {
    const titleMessage = new Discord.RichEmbed()
        .setURL(link)
        .setTitle(title)
        .setColor("ECCC00");
    return titleMessage;
}

var feedToMessage = (item, type) => {
    let message = rssToMessage(item["content:encoded"], type);
    let autor = "";
    let color = "#0eb5da";

    if (type == "ORIGINAL") {
        color = "#5c18f0";
        autor = `Autor: ${message[3]}`;
        item.title = `¡Nuevo Artículo Original!  ${item.title && item.title.trim() != "" ? item.title : ""}`;
    } else if (type == "TRADUCCION") {
        color = "#f5cf27";
        autor = `Traductor: ${message[3]}`;
        item.title = `¡Nueva Traduacción!  ${item.title && item.title.trim() != "" ? item.title : ""}`;
    } else {
        autor = `Autor del post: ${item["wikidot:authorName"]}`;
    }

    const post = new Discord.RichEmbed()
        .setURL(`${item.link}`)
        .setTitle(`:newspaper: | ${item.title && item.title.trim() != "" ? item.title : message[2]}`)
        .setAuthor(autor)
        .setDescription(`${message[0]}`)
        .setColor(color)
        .setFooter(message[1]);
    return post;
}

var rssToMessage = (content, type) => {
    let json = htmlToJson(content.trim());
    let mensaje = "";
    let pie = "";
    let user_name = "";
    let foro_opcional = "";
    switch (type) {
        case "FORO":
            let json_mensaje = json.child.slice(0, json.child.length - 5);
            let json_pie = json.child.slice(json.child.length - 5, json.child.length);
            json_mensaje.forEach(m => { mensaje += nodoToString(m) });
            json_pie.forEach(m => { pie += nodoToString(m) });
            foro_opcional = nodoToString(json_pie[json_pie.length - 1]);
            break;
        case "ORIGINAL":
            json.child.forEach(m => { mensaje += nodoToString(m) });
            pie = "Artículos originales de la Rama ES";
            user_name = getUserName(json);
            break;
        case "TRADUCCION":
            json.child.forEach(m => { mensaje += nodoToString(m) });
            pie = "Traducción de artículos para la Rama ES";
            user_name = getUserName(json);
            break;
    }

    if (mensaje.length > 1000) {
        mensaje = mensaje.substring(0, 1000)
        mensaje += " [...]"
    }

    console.log(user_name);
    return [mensaje, pie, foro_opcional, user_name]
}

var getUserName = (json) => {
    let user_name = "";
    json.child.forEach(e => {
        if (e.child) {
            e.child.forEach(c => {
                if (c.attr && c.attr.class && (c.attr.class.includes("printuser") || c.attr.class.includes("avatarhover"))) {
                    e.child.filter(l => l.tag == "a").forEach(n => {
                        if (n.child && n.child.filter(t => t.tag = "img" && t.attr).length) {
                            user_name = typeof n.child[0].attr.alt == "string" ? n.child[0].attr.alt : n.child[0].attr.alt.join(" ");
                        }
                    })
                }

            })
        }
    });
    return user_name;
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
