'use strict';
module.exports = async (client, message, args) => {
    //console.log(args);
    const user = message.mentions.users.first();
    const arg = args.slice(1).join(" ").split("|");
    const role_name = arg[0];
    const userId = arg[arg.length - 1].trim();
    const razon = arg[1];
    var member = null;
    if (user) {
        member = message.guild.member(user);
    }
    if (!isNaN(userId)) {
        member = message.guild.members.find(m => {
            //console.log(m.id == userId);
            if (m.id == userId) return m
        });
    }
    //console.log(member);

    if (member) {
        let role = message.guild.roles.find(role => role.name.toLowerCase() == role_name.toLowerCase().trim());
        if (role) {
            member.addRole(role, razon ? razon : "").then(() => {
                message.channel.send(`Se agregó el rol **${role.name}** a **${member.user.username}**`);
            }).catch((error) => {
                message.channel.send(`Sumimasen no pude agregarle el rol **${role.name}** a ${member.user.username}`);
            })
        } else {
            message.channel.send(`El rol **${role_name}** no existe no mames ┐(‘～\` )┌ `);
        }
    } else {
        message.channel.send("No has mencionado a miembro del server -__-");
    }

}

module.exports.config = {
    name: "rol",
    aliases: ["add_role", "role"],
    activo: true,
    configurable: false,
    grupo: "JR_STAFF",
    contador: 0
}