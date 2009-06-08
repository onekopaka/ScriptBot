core.unregisterPluginByEvent(Event.MESSAGE, "tropical");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if (msg[0] === "tropical") {
		// Get tropical weather XML loaded into DOM
		window.location = 'http://rss.wunderground.com/auto/rss_full/tropical/index.xml?basin=at';
		stormstatus = document.getElementsByTagName("description");
		message = stormstatus
		// Display it on the channels
		bot.sendMessage(args[0], args[1] + ": " + message);
	}
	return true;
}, "tropical");