module.exports = async (client, message, args) =>{
    message.channel.send("Oye no tengas miedo, qué te parece si te ofrezo un trato especial?");
}

module.exports.config = {
    name: "13",
    aliases: ["trece", "i-57", "trato"],
    activo: true,
    configurable: true,
    grupo: "OCIO",
    contador : 0
}