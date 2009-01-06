/**
 * PHP Plugin
 * Developed by Jonathan Steele July 2008
 * Licensed under GPL. Just like the rest of ScriptBot.
 */

core.unregisterPluginByEvent(Event.MESSAGE, "php");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if (msg[0] === "php" && msg.length > 1) {
		// Get php url for a specific function
		var phpurl = 'http://php.net/' + msg[1];
		var get_content = IO.fetchURL(phpurl).split("<p");
		var message = "Can't found that specific arguments";
		// Grab a text from that url if it is match
		for (var i = 0; i < get_content.length && !message; i++) {
			if (get_content[i].match(/^\sclass="refpurpose dc-title"/)) {
				messsage = get_content[i].substring(get_content[i].indexOf(">") + 1, get_content[i].indexOf("<"));
				message = message.substring(0, msg[1].length) + " -" + message.substring(msg[1].length + 4);
			}
		}
		// Display it on the channels
		bot.sendMessage(args[0], args[1] + ": " + message);
	} else if (msg[0] === "php" && msg.length === 1) {
		bot.sendMessage(args[0], args[1] + ": No functions provided.");
	}
	return true;
}, "php");
