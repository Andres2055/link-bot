const config_server = require("../Storage/config.json").SERVICES;
const Discord = require("discord.js");
const https = require('https');

module.exports = async (client, message, args) => {
    https.get(config_server.SCP_GENERATOR, (response) => {
        let scp_generado = '';
        response.on("data", (dat) => {
            scp_generado += dat;
        })
        console.log(response.statusCode);
        response.on("end", () => {
            if (response.statusCode == 200) {
                console.log(scp_generado);
                const embed = new Discord.RichEmbed()
                    .setDescription(`Hey intenta escribir sobre ${scp_generado}`)
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
    grupo: "OCIO"
}