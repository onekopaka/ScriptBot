/**********************************************
* A simple time plugin. It responds to "time" *
* and returns the current time of the machine *
* on which the bot is being run.              *
**********************************************/

if(!this["time"]) {
	time = {};
	time.format = function(value) {
		var a = Number(value);
		return (a + (a > 10 && a < 20 ? "th" : a % 10 === 1 ? "st" : a % 10 === 2 ? "nd" : a % 10 === 3 ? "rd" : "th"));
	};
	time.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
}

// Remove any other "time" plugins.
core.unregisterPluginByEvent(Event.MESSAGE, "time");
// Reads off the current time somewhere.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].toLowerCase();

	// Only respond to "time" messages.
	if(msg.substring(0, 4) === "time") {
		msg = Util.trim(msg.substring(4));
		var date = new Date();

		// Handle bot-local time.
		if(msg.substring(0, 4) === "time") {
			msg = Util.trim(msg.substring(4));
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var post = "";
			if(msg === "12") {
				if(hours > 12) {
					hours = hours - 12;
					post = "pm";
				} else {
					post = "am";
				}
			}
			bot.sendMessage(args[0], "It is now " + hours + ":" + ((minutes < 10)? "0": "") + minutes + ((post)? " " + post : "") + " where I live.");
		} else if(msg === "date") {
			bot.sendMessage(args[0], "Today is " + time.months[date.getMonth()] + " " + time.format(date.getDate()) + ", " + date.getFullYear());
		} else {
			bot.sendMessage(args[0], "It is now " + date);
		}

		return true;
	}
}, "time");
core.registerPluginInfo("time", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "time [date|time] [12] - Displays the current time. If \"date\" is supplied, I only return the date, and \"time\" only returns the current time (optionally in 12-hour format).");
});