/**
 *  Y! Weather Plugin
 *  Developed by Darren VanBuren July 2008
 *  Licensed under GPL.
 *  Fetch the weather from Yahoo!
 */
core.unregisterPluginByEvent(Event.MESSAGE, "yweather");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if(msg[0] === "yweather") {
		var url = "http://weather.yahooapis.com/forecastrss?p=" + msg[1];
		var xml = IO.fetchURL(url, true);
		// Construct URL for sending..
		var bugurl = bugzilla + "/show_bug.cgi?id=" + msg[1];
		bot.sendMessage(args[0], args[1] + ": "  + bugurl);
		return true;
	};
}, "yweather");