'use strict';
const google = require('googleapis').google;
module.exports = async (client, message, args) => {
	if(!client.config.get("KEY_YOUTUBE")){
		message.channel.send("Lo siento, no tengo acceso al Api de Youtube para realizar búsquedas");
		return;
	}
	var query_search = args.join(" ");
	var youtube = google.youtube({
		version: 'v3',
		auth: client.config.get("KEY_YOUTUBE")
	});

	const res = await youtube.search.list({
		part: 'id,snippet',
		q: query_search,
	});
	var vidios = res.data.items.filter(v=> v.id && v.id.videoId);
	if(!!vidios.length){
		message.channel.send(`https://www.youtube.com/watch?v=${vidios[0].id.videoId}`);
	} else {
		message.channel.send(`Lo siento, no encontré nada de eso en YouTube`);
	}
}

module.exports.config = {
	name: "yt",
	aliases: ["youtube", "find_video"],
	activo: true,
	configurable: true,
	grupo: "OCIO",
	contador: 0
}