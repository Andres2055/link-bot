'use strict'
module.exports = async (client, message, args) => {
    const user = message.mentions.users.first();
    const arg = args.slice(1).join(" ").split("|");
    const role_name = arg[0];
    const userId = arg[arg.length -1 ];
    const razon = arg[1];
    var member = null;
    if (user) {
        member = message.guild.member(user);
    }
    if (!isNaN(userId)) {
        member = message.guild.members.find(m => m.id == userId);
    }
    if (member) {
        const role = message.guild.roles.find(role => role.name.toLowerCase() == role_name.toLowerCase().trim());
        if (role) {
            member.removeRoles([role], razon ? razon : "").then(() => {
                message.channel.send(`Se eliminó el rol **${role.name}** a **${member.user.username}**`);
            }).catch((error) => {
                message.channel.send(`Sumimasen no pude quitarle el rol **${role.name}** a **${member.user.username}**`);
            })
        } else {
            message.channel.send(`El rol **${role_name}** no existe no mames ┐(‘～\` )┌ `);
        }
    } else {
        message.channel.send("No has mencionado a miembro del server -__-");
    }

}

module.exports.config = {
    name: "unrol",
    aliases: ["remove_rol", "unrole"],
    activo: false,
    configurable: false,
    grupo: "JR_STAFF",
    contador: 0
}