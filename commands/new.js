const Discord = require('discord.js');
const config = require('../config.json');
const log = require(`leekslazylogger`);
// const randomString = require('random-string');
module.exports = {
	name: 'new',
	description: 'Create a new ticket',
	usage: '<brief description>',
	aliases: ['ticket'],
	example: 'new I found an error',
	args: true,
	cooldown: config.cooldown,
	guildOnly: true,
	execute(message, args) {
		const client = message.client;
		// command starts here
		message.delete();
		let topic = args.join(" ");

		// let num = randomString({
		// 	length: 4,
		// 	numeric: true,
		// 	letters: false,
		// 	special: false,
		// });
		let id = message.author.id.toString().substr(0, 4) + message.author.discriminator;
		let chan = `ticket-${id}`;

		if (message.guild.channels.find(channel => channel.name === chan)) {
			if (config.useEmbeds) {
				const err1 = new Discord.RichEmbed()
					.setColor("#E74C3C")
					.setDescription(`:x: .יש לך כבר טיקט אחד פתוח`)
				return message.channel.send(err1)
			} else {
				message.channel.send(`:x: .יש לך כבר טיקט אחד פתוח`)
			}

		};

		message.guild.createChannel(`ticket-${id}`, {
			type: 'text'
		}).then(async c => {
			c.setParent(config.ticketsCat);
			// let supportRole = message.guild.roles.find(`id`, config.supportRole)
			let supportRole = message.guild.roles.get(config.supportRole)
			if (!supportRole) return message.channel.send(":x: No **Support Team** role found.");


			c.overwritePermissions(message.guild.defaultRole, {
				VIEW_CHANNEL: false,
				SEND_MESSAGES: false
			})
			c.overwritePermissions(message.member, {
				VIEW_CHANNEL: true,
				SEND_MESSAGES: true
			})
			c.overwritePermissions(supportRole, {
				VIEW_CHANNEL: true,
				SEND_MESSAGES: true
			})
			c.setTopic(`${message.author} | ${topic}`);
			if (config.tagHereOnly) {
				await c.send(`@here, .פתחו טיקט חדש\n`);
			} else {
				await c.send(`<@&${config.supportRole}>, .פתחו טיקט חדש\n`);
			};

			if (config.ticketImage) {
				await c.send(`__**כאן הטיקט שלך, ${message.author}**__`, {
					files: [`./image.png`]
				})
			} else {
				await c.send(`__**כאן הטיקט שלך, ${message.author}**__`)
			}

			const created = new Discord.RichEmbed()
				.setColor(config.colour)
				.setDescription(`אנא קרא את המידע שנשלח ופעל לפי כל ההוראות שניתנו\n.נוצר(${c}) הטיקט שלך`)
				.setTimestamp();
			const welcome = new Discord.RichEmbed()
				.setColor(config.colour)
				.setDescription(`**\`${topic}\` :נושא הטיקט**`)


			if (config.useEmbeds) {
				message.channel.send(created)
				let w = await c.send(welcome)
				await w.pin();
				// c.fetchMessage(c.lastMessageID).delete()
			} else {
				message.channel.send(`אנא קרא את המידע שנשלח ופעל לפי כל ההוראות שניתנו\n.נוצר(${c}) הטיקט שלך`)
				let w = await c.send(`**\`${topic}\`\n\n :נושא הטיקט**`)
				await w.pin()
				// c.fetchMessage(c.lastMessageID).delete()

			}
			// log
			if (config.useEmbeds) {
				const embed = new Discord.RichEmbed()
					.setAuthor(`${client.user.username} / Ticket Log`, client.user.avatarURL)
					.setTitle("New Ticket")
					.setColor(config.colour)
					.setDescription(`\`${topic}\``)
					.addField("Username", message.author, true)
					.addField("Channel", c, true)
					.setFooter(`DiscordTickets`)
					.setTimestamp();
				client.channels.get(config.logChannel).send({
					embed
				})
			} else {
				client.channels.get(config.logChannel).send(`**${message.author.tag} (${message.author.id})** טיקט חדש נוצר על ידי`);
			}
			log.info(`(#ticket-${id}) יצר טיקט חדש ${message.author.tag}`)
		})





		// command ends here
	},
};
