core.unregisterPluginByEvent(Event.MESSAGE, "tropical");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if (msg[0] === "tropical") {
		// Get tropical weather XML loaded into DOM
		window.setLocation = 'http://rss.wunderground.com/auto/rss_full/tropical/index.xml?basin=at';
		// Find if there's a storm.
		stormstatus = document.getElementsByTagName("description")[1].innerHTML;
		if (stormstatus) {
			// Clean up message.
			message = stormstatus.replace(/<\/?[^>]+(>|$)/g,"");
			// Display it on the channel
			bot.sendMessage(args[0], args[1] + ": " + message);
		} else {
			bot.sendMessage(args[0], args[1] + ":" + IO.fetchURL('http://rss.wunderground.com/auto/rss_full/tropical/index.xml?basin=at'));
		}
	}
	return true;
}, "tropical");