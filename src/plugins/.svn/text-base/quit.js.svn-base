// Yeah ... the bot doesn't do this for us. Could present problems if it did.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	if(args[args.length-1] === "quit") bot.exit();
});
core.registerPluginInfo("quit", function(bot, event, args, priv) {
	bot.sendMessage(args[0], "quit: Force me to leave IRC.");
});