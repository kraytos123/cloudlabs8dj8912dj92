const Discord = require('discord.js');
const config = require('../config.json');
module.exports = {
  name: 'say',
  description: 'say a message',
  usage: '',
  aliases: ['none'],
  example: '',
  args: true,
  cooldown: config.cooldown,
  guildOnly: true,
  execute(message, args) {
    const client = message.client;
      if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You dont have Permissions")
      message.delete()
      let text = args.join(" ")
      .replace('{user}', message.author)
      .replace('{user.name}', message.author.username)
      .replace('{user.id}', message.author.id)
      .replace('{user.discrime}', '#'+message.author.discriminator)
      .replace('{server.name}', message.guild.name)
      .replace('{server.id}', message.guild.id)
      .replace('{channel}', message.channel.toString())
      .replace('{channel.name}', message.channel.name)
      .replace('{channel.id}', message.channel.id)

      message.channel.send(text)
  },
};
