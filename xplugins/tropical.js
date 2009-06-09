core.unregisterPluginByEvent(Event.MESSAGE, "tropical");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if (msg[0] === "tropical") {
		// Get tropical weather XML loaded into DOM
		window.location = 'http://rss.wunderground.com/auto/rss_full/tropical/index.xml?basin=at';
		// Find if there's a storm then clean up message.
		message = document.getElementsByTagName("description")[1].innerHTML.replace(/<\/?[^>]+(>|$)/g,"");
		// Display it on the channel
		bot.sendMessage(args[0], args[1] + ": " + message);
	}
	return true;
}, "tropical");