// Reloads the specified plugin.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].toLowerCase();

	// Only respond to "time" messages.
	if(msg.substring(0, 6) === "reload") {
		msg = msg.substring(6).replace(/^\s+/,"").replace(/\s+$/,"");

		if(msg !== "") {
			IO.include("plugins" + IO.slash + msg + ".js");
		} else {
			bot.sendMessage(args[0], "Please specify a plugin name to be reloaded, " + args[1]);
		}

		return true;
	}
});