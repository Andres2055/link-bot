'use strict';

module.exports = (client, message, args) => {
    var m = args.join(" ").split("|");
    if (m.length < 2) {
        message.channel.send(`No has enviado los argumentos necesarios para este comando`);
        return;
    }
    var map = maps[m[0].trim().toLowerCase()];
    if (!map) {
        message.channel.send(`${m[0].trim().toLowerCase()} no es una opción de cifrado válida`);
        return;
    }
    var text = m[1].trim().split(" ").map(p => { return getPalabra(p.trim().toUpperCase(), map) }).join(" ").toLowerCase();
    message.channel.send(text);
};

var getPalabra = (palabra, map) => {
    var acumulador = { p: "" };
    getCifrado(acumulador, palabra, map, palabra.length);
    return acumulador.p;
};

var getCifrado = (acumulador, palabra, mapa, index) => {
    if (index > 0) {
        let v = mapa[palabra.substring(0, index)];
        if (v) {
            acumulador.p += v;
            palabra = palabra.substring(index, palabra.length);
            getCifrado(acumulador, palabra, mapa, palabra.length);
        } else if (palabra.length == 1) {
            acumulador.p += palabra;
            palabra = palabra.substring(index, palabra.length);
            getCifrado(acumulador, palabra, mapa, palabra.length);
        } else {
            getCifrado(acumulador, palabra, mapa, index - 1);
        }
    }
}

module.exports.config = {
    name: "pitch_haven",
    aliases: ["ph"],
    activo: true,
    configurable: true,
    grupo: "GENERAL",
    contador: 0,
    mp: true
};

const cifrar = {
    "A": "Æ",
    "Á": "Æ",
    "B": "P",
    "C": "A",
    "D": "K",
    "E": "Y",
    "É": "Y",
    "F": "S",
    "G": "J",
    "H": "O",
    "I": "LA",
    "Í": "LA",
    "J": "U",
    "K": "Z",
    "L": "IR",
    "M": "YI",
    "N": "L",
    "O": "I'",
    "Ó": "I'",
    "P": "V",
    "Q": "KH",
    "R": "UA",
    "S": "W",
    "T": "F",
    "U": "G",
    "Ú": "G",
    "V": "PH",
    "W": "IO",
    "X": "DE'",
    "Y": "IL",
    "Z": "XU",
    "DATOS": "DATOS",
    "ELIMINADOS": "ELIMINADOS",
    "CLOVIS": "CLOVIS",
    "FREDERICK": "FREDERICK",
    "ELIMINADO": "ELIMINADO",
    "AGATHOS": "AGATHOS",
    "█": "█",
    "SCP": "SCP"
};
const descifrar = {
    "Æ": "A",
    "P": "B",
    "A": "C",
    "K": "D",
    "Y": "E",
    "S": "F",
    "J": "G",
    "O": "H",
    "LA": "I",
    "U": "J",
    "Z": "K",
    "IR": "L",
    "YI": "M",
    "L": "N",
    "I'": "O",
    "V": "P",
    "KH": "Q",
    "UA": "R",
    "W": "S",
    "F": "T",
    "G": "U",
    "PH": "V",
    "IO": "W",
    "DE'": "X",
    "IL": "Y",
    "XU": "Z",
    "Ã": "A",
    "█": "█",
    "DATA": "DATA",
    "EXPUNGED": "EXPUNGED",
    "CLOVIS": "CLOVIS",
    "FREDERICK": "FREDERICK",
    "REDACTED": "REDACTED",
    "AGATHOS": "AGATHOS",
    "SCP": "SCP",
    "YIL": "EY",
    "YILA": "MI",
    "LAO" : "NCH",
    "LALA" : "NCI"
};
const maps = {
    "descifrar": descifrar,
    "cifrar": cifrar
};