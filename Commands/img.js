'use strict'
const Flickr = require("flickr-sdk");

module.exports = async (client, message, args) => {
    var FLICKR_TOKEN = client.config.get('FLICKR_TOKEN');
    var FLICKR_SECRET = client.config.get('FLICKR_SECRET');

    if (!FLICKR_TOKEN || !FLICKR_SECRET) {
        message.channel.send("Lo siento, pero no tengo acceso a Flickr");
        return;
    }
    var safe = true;
    args.forEach(arg => {
        if (client.config.get("SERVICES").FLICKR_FILTER.includes(arg.trim().toLowerCase())) {
            safe = false;
        }
    });
    if (!safe) {
        message.channel.send("Listen here little shit, nada de NSFW :angry_marw:");
        return;
    }

    var flickr = new Flickr(FLICKR_TOKEN);
    var textSearch = '';
    var n = 10;


    if (args.length == 1) {
        n = 100;
        if (args[0].toLowerCase() == "gato" || args[0].toLowerCase() == "cat") { textSearch = "funny+cat"; }
        else if (args[0].toLowerCase() == "caballo" || args[0].toLowerCase() == "horse") { textSearch = "funny+horse"; }
        else if (args[0].toLowerCase() == "perro" || args[0].toLowerCase() == "dog") { textSearch = "funny+dog"; }
        else {
            textSearch = args.join("+");
        }
    } else {
        textSearch = args.join("+");
    }
    console.log(textSearch);
    flickr.photos.search({
        text: textSearch,
        sort: "relevance",
        page: 1,
        per_page: n,
        safe_search: 1
    }).then(response => {
        //console.log(response.body.photos.photo);
        let photos = response.body.photos.photo;
        console.log(photos.length);
        var randomN = Math.floor((1 + Math.floor(Math.random() * 100))/photos.length);
        let url = `https://www.flickr.com/photos/${photos[randomN]['owner']}/${photos[randomN]['id']}`;
        message.channel.send(url);
    }).catch(error => {
        console.log(`error: ${error}`);
        message.channel.send("Nope, sin resultados.");
    })

    /*
    const flickrOptions = {
        api_key: FLICKR_TOKEN,
        secret: FLICKR_SECRET,
        safe_search: 3
    };

    var textSearch = '';
    var n = 10;
    var randomN = 1 + Math.floor(Math.random() * 100);

    if (args.length == 1) {
        n = 100;
        if (args[0].toLowerCase() == "gato" || args[0].toLowerCase() == "cat") { textSearch = "funny+cat"; }
        else if (args[0].toLowerCase() == "caballo" || args[0].toLowerCase() == "horse") { textSearch = "funny+horse"; }
        else if (args[0].toLowerCase() == "perro" || args[0].toLowerCase() == "dog") { textSearch = "funny+dog"; }
        else {
            textSearch = args.join("+");
            randomN = 0;
        }
    } else {
        textSearch = args.join("+");
        randomN = 0;
    }

    Flickr.tokenOnly(flickrOptions, (error, flickr) => {
        flickr.photos.search({
            
        }, (err, result) => {
            try {
                const photos = result["photos"]['photo'];
                let url = `https://www.flickr.com/photos/${photos[randomN]['owner']}/${photos[randomN]['id']}`;
                console.log(photos.length);
                message.channel.send(url);
            } catch (err) {
                console.log(error);

                message.channel.send("Nope, sin resultados.");
            }
        });
    });*/
};

module.exports.config = {
    name: "img",
    aliases: ["flickr", "image", "imagen"],
    activo: true,
    configurable: true,
    grupo: "OCIO",
    contador: 0
};
