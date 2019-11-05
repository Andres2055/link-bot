module.exports = async (client, message, args) => {
    const rol = client.commands.get("rol");
    if (rol  && rol.config.activo) {
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                let advL1 = member.roles.find(rol => rol.name.toLowerCase() == client.config.get("SERVER")["ROL_ADVERTENCIA_L1"].toLowerCase()); 
                if(advL1){
                    //Si tiene advertencia entonces debemos retirarla y agregar una advertencia nivel 2
                    let advL2 = member.roles.find(rol => rol.name.toLowerCase() == client.config.get("SERVER")["ROL_ADVERTENCIA_L2"].toLowerCase());
                    if(advL2){
                        //Si ya tiene toca poner mute
                        let mute = member.roles.find(rol => rol.name.toLowerCase() == client.config.get("SERVER")["MUTED"].toLowerCase());
                        if(mute){
                            message.channel.send(`El usuario ${member.user.username} ya tiene un mute, hay que tomar otras sanciones  (╬ Ò﹏Ó)`);
                        } else {
                            rol(client, message, getMessage(args, client.config.get("SERVER")["MUTED"]));        
                        }
                    } else {
                        rol(client, message, getMessage(args, client.config.get("SERVER")["ROL_ADVERTENCIA_L2"]));    
                    }
                } else {
                    rol(client, message, getMessage(args, client.config.get("SERVER")["ROL_ADVERTENCIA_L1"]));
                }
            } else {
                message.channel.send("Ese usuario no se encuentra en el server  (￢_￢)");
            }
        } else {
            message.channel.send("No has mencionado a ningún usuario para agregar una advertencia (ノ_<。) ");
        }
    } else {
        message.channel.send("Lo siento, no encontré los comandos de rol, por favor revisa que estén activos (*μ_μ)")
    }
};

getMessage = (args, adv) => {
    mensaje = [args[0], adv, "|", args.slice(1)];
    return mensaje;
};

module.exports.config = {
    name: "advertencia",
    aliases: ["adv", "warn"],
    activo: true,
    configurable: false,
    grupo: "JR_STAFF",
    contador : 0
}