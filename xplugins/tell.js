/*****************************************************
* A simple to delay a message to someone who may not *
* currently be active or to present in the channel.  *
* The messages are given the next time the person    *
* speaks. Timed messages can also be sent.           *
*                                                    *
* Author: A.McBain, license: CC-BY-SA                *
*****************************************************/

core.unregisterPluginByEvent(Event.MESSAGE, "tell");

var tell = {};
tell.messageMap = {};
tell.replies = [];
tell.replies.push("I'm right here. Any reason you can't say it to my face?");
tell.replies.push("Yes?");
tell.replies.push("There's plenty of other people for whom you could have left a message.");
tell.replies.push("Sorry, I'm not listening right now ...");
tell.replies.push("I'd love to, but I've gotta run.");
tell.replies.push("Bite my shiny metal ass!");

if(IO.objectExists("tellplugin")) {
	tell.messageMap = IO.readObject("tellplugin");
}

core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var channel = args[0];
	var sender = args[1];
	var message = args[args.length - 1].replace(/^\s/,"");

	var codeSpace = message.indexOf(" ");
	if(message.substring(0, codeSpace) === "tell") {
		message = message.substring(codeSpace + 1);
		var nickSpace = message.indexOf(" ")
		var nick = message.substring(0, nickSpace);
		var msg = message.substring(nickSpace + 1);

		if(nick === "clear") {
			var nick = Util.trim(msg);

			if(tell.messageMap[channel] === undefined || tell.messageMap[channel][nick] === undefined || tell.messageMap[channel][nick].length === 0) {
				bot.sendMessage(channel, "There are no messages queued for " + nick + ", " + sender);
			} else {
				var messages = tell.messageMap[channel][nick];
				var count = 0;
				for(var i = 0; i < messages.length; i++) {
					if(messages[i][0] === sender) {
						delete tell.messageMap[channel][nick][i];
						count++;
					}
				}
				if(count > 0) {
					bot.sendMessage(channel, count + " message" + ((count === 1)? "" : "s") + " from " + sender + " removed.");
				} else {
					bot.sendMessage(channel, "There are no queued messages from you to delete, " + sender);
				}
			}
		} else {
			if(nick === (bot.getNick() + "")) {
				bot.sendMessage(channel, tell.replies[Math.min(tell.replies.length - 1, Math.floor(Math.random() * tell.replies.length))]);
			} else if(Util.trim(msg) !==  "") {
				if(!tell.messageMap[channel]) {
					tell.messageMap[channel] = {};
				}
				if(!tell.messageMap[channel][nick]) {
					tell.messageMap[channel][nick] = [];
				}
				tell.messageMap[channel][nick].push([sender, msg.replace(/\sI\s/g," they ").replace(/^I\s/,"They ")]);
				bot.sendMessage(channel, "Okay " + sender + ", I'll tell " + nick + " next time I see them.");
				IO.writeObject("tellplugin", tell.messageMap);
			} else {
				bot.sendMessage(channel, "You must supply a message, " + sender);
			}
		}
	}
}, "tell");

core.registerUnrestrictedPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var channel = args[0];
	var sender = args[1];
	if(tell.messageMap[channel] !== undefined && tell.messageMap[channel][sender]) {
		var messages = tell.messageMap[channel][sender];
		for(var i = 0; i < messages.length; i++) {
			if(messages[i] !== undefined) {
				bot.sendMessage(channel, sender + ", " + messages[i][0] + " wanted me to tell you: " + messages[i][1]);
			}
		}
		delete tell.messageMap[sender];
		IO.writeObject("tellplugin", tell.messageMap);
	}
}, "tell");

core.registerPluginInfo("tell", function(bot, event, args, priv) {
	var channel = args[0];
	bot.sendMessage(channel, bot.prefix + "tell [clear] nick [message] - clear removes any queued messages for that nick from the sender. Otherwise it queues non-empty messages to be given to the user when they return.");
}, "tell");
