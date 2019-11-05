const Wiki = require('wikijs').default;

var toCapitalize = array => {
	var strCapitalized = '';
	for (var i = 0; i < array.length; i++) {
		if(i == array.length - 1) {
			strCapitalized += array[i].charAt(0).toUpperCase() + array[i].substr(1);
		} else {
			strCapitalized += array[i].charAt(0).toUpperCase() + array[i].substr(1) + '_';
		}
	}
	return strCapitalized;
}

module.exports = async (client, message, args) => {
	const searchWiki = Wiki({ apiUrl: client.config.get("SERVICES").WIKIPEDIA });

	searchWiki.page(toCapitalize(args)).then(page => {
		message.channel.send(page["raw"]["fullurl"]);
	}).catch(err => {
		console.log("Hubo un error de tipo: " + err);
		message.channel.send("Σ(°△°|||)  hay problema consultado a Wikipedia, inténtalo luego");
	});
}

module.exports.config = {
	name: "wiki",
	aliases: ["wikipedia"],
	activo : true,
	configurable: true,
	grupo: "GENERAL",
	contador : 0
}