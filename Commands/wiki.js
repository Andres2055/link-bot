'use strict';
const wiki = require('wikijs');

// var toCapitalize = array => {
// 	var strCapitalized = '';
// 	for (var i = 0; i < array.length; i++) {
// 		if(i == array.length - 1) {
// 			strCapitalized += array[i].charAt(0).toUpperCase() + array[i].substr(1);
// 		} else {
// 			strCapitalized += array[i].charAt(0).toUpperCase() + array[i].substr(1) + '_';
// 		}
// 	}
// 	return strCapitalized;
// }

module.exports = async (client, message, args) => {
	// const searchWiki = Wiki({ apiUrl: client.config.get("SERVICES").WIKIPEDIA });
	try {
		const page = await wiki.default({ apiUrl: client.config.get("SERVICES").WIKIPEDIA }).find(args.join(" "));
		// console.log(page);
		// console.log(page.fullurl);
		message.channel.send(page.fullurl)
	} catch (error) {
		console.log("Ocurrió un error al consultar wikipedia");
		console.log(error);
		message.channel.send("Σ(°△°|||) no encontré ese artículo en wikipedia");
	}
}

module.exports.config = {
	name: "wiki",
	aliases: ["wikipedia"],
	activo: true,
	configurable: true,
	grupo: "GENERAL",
	contador: 0
}