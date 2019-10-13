module.exports = async (client, message, args) => {
    const user = message.mentions.users.first();
    const arg = args.slice(1).join(" ").split("|", 2);
    const role_name = arg[0];
    const razon = arg[1];
    if (user) {
        const member = message.guild.member(user);
        if (member) {
            role = message.guild.roles.find(role => role.name.toLowerCase() == role_name.toLowerCase().trim());
            if (role) {
                member.removeRoles([role], razon ? razon : "").then( () => {
                    message.channel.send(`Se eliminó el rol ${role} a ${member.user.username}`)
                }).catch((error) => {
                    message.channel.send(`Sumimasen no pude quitarle el rol ${role} a ${member.user.username}`);
                })
            } else {
                message.channel.send(`El rol ${role_name} no existe no mames`);
            }
        } else {
            message.channel.send("Ese usuario no se encuentra en el server -__-");
        }
    } else {
        message.channel.send("No has mencionado a ningún usuario para retirar un rol");
    }
}

module.exports.config = {
    name: "unrol",
    aliases: ["remove_rol", "unrole"],
    activo: true,
    configurable: false,
    grupo: "ADMIN"
}