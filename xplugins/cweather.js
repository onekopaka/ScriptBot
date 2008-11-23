/**
 * Gets the current condition
 * of a city by it's zip code
 * from the CDYNE weather service.
 *
 * @author Hunter Ryba
 * @date Sunday, November 23, 2008
 */

core.unregisterPluginByEvent(Event.MESSAGE, "cweather");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	
	if(msg[0] === "cweather" && msg.length > 1) {
		url = "http://ws.cdyne.com/WeatherWS/Weather.asmx/GetCityWeatherByZIP?ZIP=" + msg[1].toUpperCase();
		var report = IO.fetchURL(url, true);
		var output = "";
		
		for(var i in report) { output += report[i].replace(/^\s+/,"").replace(/\s+$/,"") + " "; }
				
		if( output.match(/<Success>(.*)<\/Success>/)[1] == "true" ) {
			var temperature = output.match(/<Temperature>(.*)<\/Temperature>/)[1] + "°F";
			var condition = (output.match(/<Description>(.*)<\/Description>/) !== null ? output.match(/<Description>(.*)<\/Description>/)[1].toLowerCase() : "");
			var location = output.match(/<City>(.*)<\/City>/)[1] + ", " + output.match(/<State>(.*)<\/State>/)[1];
			var wind = output.match(/<Wind>(.*)<\/Wind>/)[1]; var wind = {direction:wind.match(/(\D+)(\d*)/)[1], speed:wind.match(/(\D+)(\d*)/)[2] + "mph"};
			
			bot.sendMessage(args[0], args[1] + ": It is currently " + temperature + (condition !== "" ? " and " + condition : "") + " in " + location + ". The wind is from the " + wind.direction + " blowing at " + wind.speed + ".");
		} else {
			bot.sendAction(args[0], "hands " + args[1] + " a valid zip-code and stamps their hand");
		}
		return true;
	} else if(msg[0] === "cweather" && msg.length === 1) {
		bot.sendAction(args[0], "hands " + args[1] + " a valid zip-code and stamps their hand");
		return true;
	}
}, "cweather");