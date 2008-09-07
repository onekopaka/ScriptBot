/***************************************************
* A simple time plugin. It responds to "wtime"     *
* and returns the current time of the machine      *
* on which the bot is being run. Alternatively,    *
* a place can be specified, and the bot will       *
* ask worldtimeserver.com for the current time     *
* in the location and return it.                   *
*                                                  *
* World Time Plugin - By A.McBain                  *
*                                                  *
* The World Time plugin is licensed under the      *
* Creative Commons Attribution Share Alike License *
***************************************************/

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
			var result = IO.fetchURL("http://www.worldtimeserver.com/search.aspx?searchfor=" + msg.replace(/\s+/g,"+")).replace(/\n/g,"");
			var title = /<title>(.*?)<\/title>/.exec(result);
			var time = /<div id="analog-digital">\s+<span class="font7">(.*?)<\/span>\s+<\/div>/.exec(result);
			if(time !== null) {
				time = Util.trim(time[1]);
				bot.sendMessage(args[0], "The current time in " + msg + " is " + time + ". (www.worldtimeserver.com/search.aspx?searchfor=" + msg.replace(/\s+/g,"+") + ")");
			} else if(title !== null && title.length > 1 && title[1] === "World Time Server Search Results")  {
				result = result.substring(result.indexOf("<p>") + 3, result.lastIndexOf("</p>")).split("<a");
				var cities = "";
				if(result.length > 1) {
					for(var i = 1; i < result.length; i++) {
						var parts = /href="(.*?)">(.*?)<\/a>/.exec(result[i]);
						if(parts) {
							cities += parts[2] + " (" + parts[1].substring(parts[1].lastIndexOf("_") + 1, parts[1].lastIndexOf(".")) + "), ";
						}
					}
					cities = cities.replace(/,\s$/,"");
					if(cities.substring(0,cities.indexOf(" (")) !== "Please click here to go to the World Time Server web site") {
						bot.sendMessage(args[0], "Did you mean: " + cities);
					} else if(msg === "here") {
						bot.sendMessage(args[0], "Could not get the current time for " + msg + ". No, seriously. Get a watch.");
					} else {
						bot.sendMessage(args[0], "Could not get the current time for " + msg + ".");
					}
				}
			}
		}

		return true;
	}
}, "wtime");
core.registerPluginInfo("wtime", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "wtime [location] - Attempts to find the current time in the given location. If the location cannot be found, a list of alternatives may be displayed. Enter one of the abbreviations in parenthesis and try again.");
});