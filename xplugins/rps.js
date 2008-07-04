// Lets users play rock-paper-scissors with the bot.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var user = args[args.length-1].toLowerCase();

	if(user === "rock" || user === "paper" || user === "scissors") {
		var choices = ["rock", "paper", "scissors"];
		var ans = choices[Math.min(Math.floor(Math.random()*3),2)];

		var msg = false;
		if(ans === user) {
			bot.sendMessage(args[0], ans + ". We tied.");
			return;
		} else if(ans === "rock") {
			msg = user !== "paper";
		} else if(ans === "paper") {
			msg = user !== "scissors";
		} else if(ans === "scissors") {
			msg = user !== "rock";
		}

		if(msg) {
			bot.sendMessage(args[0], ans + ". I win!");
		} else {
			bot.sendMessage(args[0], ans + ". I lose.");
		}

		return true;
	}
});
function rockpaperscissors(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "[rock|paper|scissors] - Plays the game rock-paper-scissors with me.");
}
core.registerPluginInfo("rock", rockpaperscissors);
core.registerPluginInfo("paper", rockpaperscissors);
core.registerPluginInfo("scissors", rockpaperscissors);

core.registerUnhandledEventPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	bot.sendMessage(args[0], "I don't know anything about '" + args[args.length-1].substring(0, Math.min(args[args.length-1].length, 20)) + "', " + args[1]);
});