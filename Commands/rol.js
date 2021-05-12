'use strict';
module.exports = async (client, message, args) => {
    //console.log(args);
    // const user = message.mentions.users.first();
    const arg = args.join(" ").split("|");
    const userName = arg[0];
    const role_name = arg[1];
    const userId = arg[arg.length - 1].trim();
    const razon = arg[2];
    var member = null;
    // if (user) {
    // member = message.guild.member(user);
    // }
    if (!isNaN(userId)) {
        try {
            member = await message.guild.members.fetch(userId);
        } catch (error) {
            console.log(`No pude encontrar al usuario usando el ID ${userId}`)
            console.log(error)
        }
    }

    if (!member) {
        try {
            console.log(`Buscando al usuario con nombre ${userName}`);
            const members = await message.guild.members.fetch({ query: userName.trim() });
            member = members.first();
        } catch (error) {
            console.log(`No pude encontrar al usuario con nombre ${userName}`);
            console.log(error);
        }
    }

    // console.log(member);

    if (member) {
        let role = message.guild.roles.cache.find(role => role.name.toLowerCase() == role_name.toLowerCase().trim());
        if (role) {
            member.roles.add(role, razon ? razon : "").then(() => {
                message.channel.send(`Se agregó el rol **${role.name}** a **${member.user.username}**`);
            }).catch((error) => {
                console.log(error);
                message.channel.send(`Sumimasen no pude agregarle el rol **${role.name}** a ${member.user.username}`);
            })
        } else {
            message.channel.send(`El rol **${role_name}** no existe no mames ┐(‘～\` )┌ `);
        }
    } else {
        message.channel.send("No has mencionado a ningún miembro del server -__-");
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