'use strict';
const grupo39 = ["Érase la historia de un pequeño soñador. Érase la historia de una sonrisa",
    "Palabras, palabras y más palabras. ¿Importan realmente? ¿Acaso alguien las toma en cuenta?",
    "Un hombre, una mujer, y un Dios. Justo como en la vieja era"];
const grupo30 = ["Temblaban sus manos, miedo en su corazón. Profunda mirada, sonrisa puntiaguda cual bestia",
    "Yo solo quería capitanear un maldito destacamento móvil, coño de su madre, vale",
    "Yo no pedí desaparecer, seguro lo saben. Pero tampoco pedí volver a aparecer"];
const grupo21 = ["Vientos huracanados gritan y bailan en armonía. Está sucediendo, ¡está sucediendo de nuevo!",
    "Corazón de caldera y ornamentos de fuego, danzan y danzan, lloran y ríen",
    "Milenario mal del más allá, trae consigo un beneficio falso, buscan algo más"];
const grupo9 = ["¿Y tú qué hostias te traes con tus juegos, eh, capullo? ¡Responde! ¡Responde!",
    "Impuro deseo. Enorme la codicia. La gula como el rey de la montaña",
    "Oye no tengas miedo, qué te parece si te ofrezo un trato especial?"];
const final = "El bien triunfa. El mal, enterrado, jamás podrá volver a hacernos daño. Ríe";

var numMen = () => {
    return Math.floor(Math.floor(Math.random() * 9) / 3);
}
module.exports = async (client, message, args) => {
    var pro_grupos = Math.floor(Math.random() * 100);
    var mensaje = "";
    var i = numMen();
    console.log(pro_grupos);
    console.log(i);
    if (pro_grupos == 13) {
        mensaje = final;
    } else if (pro_grupos <= 39) {
        mensaje = grupo39[i]
    } else if (pro_grupos > 39 && pro_grupos <= 69) {
        mensaje = grupo30[i];
    } else if (pro_grupos > 69 && pro_grupos <= 90) {
        mensaje = grupo21[i];
    } else if (pro_grupos > 91) {
        mensaje = grupo9[i];
    }
    message.edit(mensaje);
}

module.exports.config = {
    name: "13",
    aliases: ["trece", "i-57", "trato"],
    activo: true,
    configurable: true,
    grupo: "OCIO",
    contador: 0
}