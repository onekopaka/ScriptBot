/************************************************
* A simple time plugin. It responds to "time"   *
* and returns the current time of the machine   *
* on which the bot is being run. Alternatively, *
* a place can be specified, and the bot will    *
* ask Google for the current time in the        *
* location and return it.                       *
************************************************/

// Remove any other "time" plugins.
core.unregisterPluginByEvent(Event.MESSAGE, "time");
// Reads off the current time somewhere.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].toLowerCase();

	// Only respond to "time" messages.
	if(msg.substring(0, 5) === "time") {
		msg = msg.substring(5).replace(/^\s+/,"").replace(/\s+$/,"");
print(msg);
		// Handle bot-local time; otherwise foreign time.
		if(msg === "") {
			var date = new Date();
			bot.sendMessage(args[0], "It is now " + date.getHours() + ":" + date.getMinutes());
		} else {
			bot.sendMessage(args[0], "Current time in " + msg + " is ");
		}

		return true;
	}
}, "time");