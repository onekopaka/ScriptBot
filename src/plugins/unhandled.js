/**********************************
* A simple plugin which points    *
* out of a message wasn't handled *
* handled by the bot.             *
**********************************/

core.registerUnhandledEventPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var elipsis = (args[args.length-1].length > 20)? "..." : "";
	bot.sendMessage(args[0], "I don't know anything about '" + args[args.length-1].substring(0, Math.min(args[args.length-1].length, 20)) + elipsis + "', " + args[1]);
});