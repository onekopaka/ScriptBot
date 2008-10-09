/************************************************
* A simple rock-paper-scissors plugin. It       *
* responds to rock, paper, and scissors. A      *
* random choice is made for the bot, and the    *
* result is reported to the channel (win loss). *
************************************************/

// Lets users play rock-paper-scissors with the bot.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var user = args[args.length-1].toLowerCase();

	if(user === "rock" || user === "paper" || user === "scissors") {
		var choices = ["rock", "paper", "scissors"];
		var ans = choices[Math.min(Math.floor(Math.random()*3),2)];

		var msg = false;
		if(ans === user) {
			bot.sendMessage(args[0], ans + ". We tied.");
			return true;
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
