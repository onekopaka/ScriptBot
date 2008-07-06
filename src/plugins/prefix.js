/************************************************
* A simple plugin to allow changing the prefix  *
* the bot responds to in the channel. This does *
* not affect unrestricted plugins.              *
************************************************/

// Allows users to change the prefix in channel. Mainly just because or testing.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if(msg[0] === "prefix" && msg.length === 1) {
		bot.sendMessage(args[0], "I can be addressed using '" + bot.prefix + "', " + args[1]);
		return true;
	} else if(msg[0] === "prefix" && msg.length > 1) {
		bot.prefix = msg[1];
		bot.sendMessage(args[0], "I will now respond to '" + bot.prefix + "', " + args[1]);
		return true;
	}
});
core.registerPluginInfo("prefix", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "prefix [new] - Displays the current prefix for me. If an optional parameter is given, it will set the current prefix to it.");
});