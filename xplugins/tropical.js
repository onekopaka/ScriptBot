core.unregisterPluginByEvent(Event.MESSAGE, "tropical");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if (msg[0] === "tropical") {
		// Get tropical weather XML URL
		var get_content = IO.fetchURL('http://rss.wunderground.com/auto/rss_full/tropical/index.xml?basin=at');
		var message = '';
		// Grab a text from that url if it is match
		for (var i = 0; i < get_content.length && !message; i++) {
			message = get_content.match(/<description><![CDATA[(.*)]]<\/description>/)[1].replace(/<\/?[^>]+(>|$)/g,"");
		}
		// Display it on the channels
		bot.sendMessage(args[0], args[1] + ": " + message);
	}
	return true;
}, "tropical");