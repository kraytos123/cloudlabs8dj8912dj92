const Discord = require('discord.js');
const config = require('../config.json');
const log = require(`leekslazylogger`);
module.exports = {
  name: 'close',
  description: 'Close a ticket',
  usage: '',
  aliases: ['none'],
  example: '',
  args: false,
  cooldown: config.cooldown,
  guildOnly: true,
  execute(message, args) {
    const client = message.client;
    // command starts here
    message.delete();
    if(!message.channel.name.startsWith('ticket-')) { // // !message.channel.name.length() == 15 &&
      if(config.useEmbeds) {
        const notTicket = new Discord.RichEmbed()
            .setColor("#E74C3C")
            .setDescription(`:x: **הפקודה הזאתי יכולה להיות רק בתוך טיקט פתוח**`)
        return message.channel.send(notTicket);
      } else {
        return message.channel.send(`:x: **הפקודה הזאתי יכולה להיות רק בתוך טיקט פתוח**`)
      }
    } else {
      try {
        message.channel.delete()
        // log
  	    if(config.useEmbeds) {
  	      const embed = new Discord.RichEmbed()
  	        .setAuthor(`${client.user.username} / Ticket Log`, client.user.avatarURL)
  	        .setTitle("הטיקט נסגר")
  					.setColor(config.colour)
  	        .addField("סוגר הטיקט", message.author, true)
  	        .addField("בחדר", message.channel.name, true)
  	        .setFooter(`CloudLabs`)
  					.setTimestamp();
  	      client.channels.get(config.logChannel).send({embed})
  	    } else {
  	      client.channels.get(config.logChannel).send(`**(${message.author.id}) ${message.author.tag}** הטיקט נסגר על ידי`);
  	    }
  			log.info(`(#${message.channel.name}) סגר את הטיקט ${message.author.tag}`)

      } catch(error) {
        log.error(log.colour.red(error));
      }
    }




    // command ends here
  },
};
