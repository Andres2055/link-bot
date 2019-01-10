const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
	const imgs = [ "",
			"https://imgur.com/fMnphdh", 
			"https://imgur.com/5R5CGat", 
			"https://imgur.com/xQ6KPrZ",
			"https://imgur.com/ix1Dwxo",
			"https://imgur.com/KNph2L7",
			"https://imgur.com/jHnLBtE",
			"https://imgur.com/t/dab/TMukmjp",
			"https://imgur.com/t/dab/etGSF",
			"https://imgur.com/t/dab/OOBWy"
		]

	const dabNum = 1 + Math.floor(Math.random() * (imgs.length - 1));
	message.channel.send(imgs[dabNum])
}

module.exports.help = {
	name: "dab",
	aliases: []
}