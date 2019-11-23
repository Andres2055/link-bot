'use strict'
//Agregar un arreglo con los usuarios advertidos para no volver a advertirles hasta dentro de unos minutos más
//Con eso deberíamos evitar los mensajes repetidos del bot
module.exports.validarSpam = (client, message) => {
    //console.log("===================validando Spam==================");
    let response = [];
    //console.log(client.config.get("ANTISPAM").EXCEPCIONES);
    //console.log(message.channel.id);
    if(client.config.get("ANTISPAM").EXCEPCIONES.includes(message.channel.id.toString())){
        //console.log("Nope, acá no vamos a validar el spam");
        return response;
    }
    let now = Date.now();
    const flood = client.config.get("ANTISPAM").FLOOD; //Número de mensajes que serán considerados como flood
    const min_interval = client.config.get("ANTISPAM").MIN_INTERVAL * 1000; //Tiempo mínimo entre los mensajes considerados para flood
    const interval = client.config.get("ANTISPAM").INTERVAL * 60000; //Intervalo en que será validado el spam 
    const max_attachment = client.config.get("ANTISPAM").MAX_ATTACHMENT; //Número de adjuntos que serán considerados como spam
    const max_men_channel = client.config.get("ANTISPAM").MAX_MESSAGE_CHANNEL; //Máximo número de mensajes idénticos en un mismo canal que serán tomados como spam
    var array_warned = client.warned_users.filter(u => u.user == message.author.id && !u.image && ((now - u.time) < interval));
    var warnable = !array_warned.length;
    var warnable_channel = !client.warned_users.filter(u => u.channel == message.channel.id && ((now - u.time) < interval)).length;
    var warnable_images = !client.warned_users.filter(u => u.user == message.author.id && u.image && ((now - u.time) < interval)).length;
    //console.log(`el mensaje enviado por ${message.author} ${warnable ? " es punible por flood " : " no es punible por flood"}`);
    //console.log(`el mensaje enviado por ${message.author} ${warnable_channel ? " es punible por spam en el canal " : " no es punible por spam en el canal"}`);
    //console.log(`el mensaje enviado por ${message.author} ${warnable_images ? " es punible por spam de adjuntos " : " no es punible por spam de adjuntos"}`);

    if (client.warned_users.length >= 20) {
        client.warned_users = client.warned_users.slice(0, 10);
    }
    if (client.cache_message.length >= 100) {
        client.cache_message = client.cache_message.slice(0, 90);
    }

    client.cache_message.push({
        channel: message.channel.id,
        autor: message.author.id,
        time: now,
        content: message.content,
        adjuntos: message.attachments.size
    });
    //console.log(client.cache_message);
    //Se valida el total de mensajes idénticos dentro de un mismo canal enviados por diferentes usuarios
    let messages_channel = client.cache_message.filter(m => m.channel == message.channel.id && now - m.time <= (interval) && (message.content == m.content) && warnable_channel);
    //Se valida el total de mensajes del caché que serán clasificados como flood 
    let flood_match = client.cache_message.filter(m => m.autor == message.author.id && now - m.time <= (min_interval) && (message.content.length < 7 || m.content == message.content) && warnable).length;
    //Se valida la cantidad de adjuntos enviados por un mismo usuario
    let adjuntos_match = 0;
    client.cache_message.forEach(m => {
        if (message.author.id && now - m.time <= (interval)) {
            adjuntos_match += message.attachments.size;
        }
    });
    if (messages_channel.length >= max_men_channel && warnable_channel) {
        let users = [];
        messages_channel.forEach(m =>{
            if(!users.includes(m.autor) && warnable){
                users.push(m.autor);
            }
        });
        console.log(users);
        response.push({ type: "CHANNEL", users: users, channel: message.channel.id });
        client.warned_users.push({ channel: message.channel.id, time: now });
        /*messages_channel.forEach(i => {
            client.warned_users.push({ user: i.autor, time: now });
        })*/
    }
    if (flood_match >= flood && warnable) {
        response.push({ type: "FLOOD", user: message.member.id, channel: message.channel.id });
        client.warned_users.push({ user: message.member.id, time: now });
    }
    if (adjuntos_match >= max_attachment && warnable_images) {
        response.push({ type: "ATTACHMENT", user: message.member.id, channel: message.channel.id });
        client.warned_users.push({ user: message.member.id, image: true, time: now });
    }
    return response;
};
//324174158063992832
module.exports.handleSpam = async (client, response, message) => {
    response.forEach(resp => {
        let warn = client.commands.get("advertencia");
        let channel = message.guild.channels.find(chan => chan.id == resp.channel);
        switch (resp.type) {
            case "CHANNEL":
                console.log("Vamos a advertir a varios weones");
                message.channel.send(`Detengan el spam. Los involucrados serán sancionados`);
                resp.users.forEach((user, i) => {
                    client.setTimeout(() => {
                        let men_chan = `${user} pariticipar en el spam del canal ${channel} | 1 día`
                        console.log(men_chan);
                        warn(client, message, men_chan.split(" "));
                    }, i * 10000);
                });
                break;
            case "FLOOD":
                let mflood = `${resp.user} hacer _Flood_ en el canal ${channel} | 1 día`
                warn(client, message, mflood.split(" "));
                break;
            case "ATTACHMENT":
                let matt = `${resp.user}  enviar demasiados archivos adjuntos en el canal ${channel} | 1 día`
                warn(client, message, matt.split(" "));
                break;
        }
    });
};