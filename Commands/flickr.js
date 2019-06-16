const Discord = require("discord.js");
const Flickr = require("flickrapi");
const flickrConfig = require("./../Storage/config.json")

/* Deviroment Variables */

var FLICKR_TOKEN = process.env.FLICKR_TOKEN || flickrConfig['FLICKR_TOKEN'];
var FLICKR_SECRET = process.env.FLICKR_SECRET || flickrConfig['FLICKR_SECRET'];

/* Deviroment Variables */
/* Authentication */

flickrOptions = {
	api_key: FLICKR_TOKEN,
	secret: FLICKR_SECRET
};

/* Authentication */

var arrayToString = array => {
	let textToString = "";

	for (let i = 0; i < array.length; i++) { 
		if (i < (array.length - 1)) { textToString += array[i] + '+'; } 
		else { textToString += array[i]; };
	};

	return textToString
}

module.exports.run = async (client, message, args) => {
	var textSearch = '';
	var n = 10;
	var randomN = 1 + Math.floor(Math.random() * 100);

	
	if(args.length == 1) {
		n = 100;
		if (args[0].toLowerCase() == "gato" || args[0].toLowerCase() == "cat") { textSearch = "funny+cat"; }
		else if (args[0].toLowerCase() == "caballo" || args[0].toLowerCase() == "horse") { textSearch = "funny+horse"; }
		else if (args[0].toLowerCase() == "perro" || args[0].toLowerCase() == "dog") { textSearch = "funny+dog"; }
		else {
			textSearch = arrayToString(args);
			randomN = 0;
		}
	} else { 
		textSearch = arrayToString(args);
		randomN = 0;
	}

	Flickr.tokenOnly(flickrOptions, (error, flickr) => {
		flickr.photos.search({
			text: textSearch,
			sort: "relevance",
			page: 1,
			per_page: n
		}, (err, result) => {
			console.log(result)
			try {
				const photos = result["photos"]['photo'];
				url = `https://www.flickr.com/photos/${photos[randomN]['owner']}/${photos[randomN]['id']}`;
				message.channel.send(url);
			} catch(err) {
				message.channel.send("Nope, sin resultados.");
			}
		});
	});
};

module.exports.help = {
	name: "img",
	aliases: ["flik"]
};

