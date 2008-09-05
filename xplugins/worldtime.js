/************************************************
* A simple time plugin. It responds to "wtime"  *
* and returns the current time of the machine   *
* on which the bot is being run. Alternatively, *
* a place can be specified, and the bot will    *
* ask worldtimeserver.com for the current time  *
* in the location and return it.                *
************************************************/

// Remove any other "time" plugins.
core.unregisterPluginByEvent(Event.MESSAGE, "wtime");
// Reads off the current time somewhere.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].toLowerCase();

	// Only respond to "time" messages.
	if(msg.substring(0, 5) === "wtime") {
		msg = Util.trim(msg.substring(5));

		// Handle bot-local time; otherwise foreign time.
		if(msg !== "") {
			var result = IO.fetchURL("http://www.worldtimeserver.com/search.aspx?searchfor=" + msg).replace(/\n/g,"");
			result = /<div id="analog-digital">\s+<span class="font7">(.*?)<\/span>\s+<\/div>/.exec(result);
			if(result !== null) {
				result = Util.trim(result[1]);
				bot.sendMessage(args[0], "The current time in " + msg + " is " + result + ". (www.worldtimeserver.com/search.aspx?searchfor=" + msg + ")");
			} else {
				bot.sendMessage(args[0], "Could not get the current time for " + msg + ".");
			}
		}

		return true;
	}
}, "wtime");