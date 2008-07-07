/**
 * Weather Plugin
 * Developed by Darren VanBuren July 2008
 * Licensed under GPL. Just like the rest of ScriptBot.
 */
core.unregisterPluginByEvent(Event.MESSAGE, "weather");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if(msg[0] === "weather" && msg.length > 1) {
		// This build us a URL.
		url = "http://oks.verymad.net/~onekopaka/phpweather/scriptbot.php?icao=" + msg[1].toUpperCase();
		var report = IO.fetchURL(url, true);
		var output = "";
		for(var i in report) { output += report[i].replace(/^\s+/,"").replace(/\s+$/,"") + " "; }
		if(output.length < 390) {
			bot.sendMessage(args[0], args[1] + ": " + output);
		} else {
			var one = output.substring(0, 390);
			var two = output.substring(390);
			var match = one.substring(one.lastIndexOf(" "));
			one = one.replace(match, "");
			two = match.replace(/^\s+/,"") + two;
			bot.sendMessage(args[0], args[1] + ": " + one);
			bot.sendMessage(args[0], args[1] + ": " + two);
		}
		return true;
	} else if(msg[0] === "weather" && msg.length === 1) {
		bot.sendMessage(args[0], args[1] + ": No station provided.");
		//bot.sendAction(args[0], "slaps, kicks and punches " + args[1]); 
		return true;
	}
}, "weather");
