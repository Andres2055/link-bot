'use strict'
module.exports = (client, message, args) => {
    var time_out = args[0];
    if (!time_out || isNaN(time_out)){
        message.channel.send("Debes enviar el tiempo que será desactivado el protocolo");
        return;
    }
    if(time_out>60){
        message.channel.send("Hey, el tiempo no puede superar los 60 minutos :angry_marw:");
        return;
    }
    client.config.get("ANTISPAM").CANALES_TEMPORALES.push(message.channel.id.toString());
    message.channel.send(`Vale menes, no habrá validación de spam en ${message.channel} durante los siguientes ${time_out} minutos. No se descontrolen`);
    client.setTimeout(() => {
        client.config.get("ANTISPAM").CANALES_TEMPORALES = client.config.get("ANTISPAM").CANALES_TEMPORALES.filter(c => c!= message.channel.id.toString());
        message.channel.send(`El protocolo antispam ha vuelto a quedar vigente`);
    }, time_out * 60000);

};
module.exports.config = {
    name: "antispam",
    aliases: ["desactivar_antispam"],
    activo: true,
    configurable: true,
    grupo: "ADMIN",
    contador: 0
}