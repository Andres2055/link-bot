'use strict';
const Discord = require("discord.js");
const https = require('https');

module.exports = async (client, message, args) => {
    https.get(client.config.get("SERVICES").SCP_GENERATOR, (response) => {
        let scp_generado = '';
        response.on("data", (dat) => {
            scp_generado += dat;
        })
        response.on("end", () => {
            if (response.statusCode == 200) {
                const embed = new Discord.RichEmbed()
                    .setDescription(`Idea for SCP: ${scp_generado}`)
                    .setAuthor(message.author.username, message.author.displayAvatarURL)
                    .setColor("0040ff");
                message.channel.send({ embed });
            } else {
                message.channel.send('Lo siento no pude conectarme al servicio de SCP-Generator');
            }
        });
    }).on("error", (error) => {
        console.log(error);
        message.channel.send('Lo siento no pude conectarme al servicio de SCP-Generator');
    });
}

module.exports.config = {
    name: "generate",
    aliases: ["gen_scp", "scp_generator"],
    activo: true,
    configurable: true,
    grupo: "OCIO",
    contador : 0
}