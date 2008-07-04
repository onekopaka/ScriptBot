// Just a funny add on ...
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var characters = ["bender", "professor", "zoidberg"];

	// Random quote on mentioning ...
	if(args[args.length-1].toLowerCase().indexOf("futurama") >= 0) {
		args[args.length-1] = characters[Math.min(Math.floor(Math.random()*3),2)];
	}

	var msg = "";
	switch(args[args.length-1]) {
		case "bender":    msg = "Bite my shiny metal ass!"; break;
		case "professor": msg = "Good news everyone!"; break;
		case "zoidberg":  msg = "Why not Zoidberg?";
	}

	if(msg !== "") {
		bot.sendMessage(args[0], msg);
		return true;
	}
});
var futuramaRefireEvent = false;
core.registerUnrestrictedPlugin(Event.MESSAGE, function(bot, event, args, priv) {

	// Random quote on mentioning ...
	var hasTarget = Util.verifyTarget(bot.getNick(), args[args.length-1]) || Util.verifyTarget(bot.prefix, args[args.length-1]);
	if(!futuramaRefireEvent && !hasTarget && args[args.length-1].toLowerCase().indexOf("futurama") >= 0) {
		futuramaRefireEvent = true;
		bot.fireMessageEvent(Event.MESSAGE, [args[0],args[1],args[2],args[3],bot.prefix+"futurama"], priv);
	}
	futuramaRefireEvent = false;
});

// Allows users to change the prefix in channel. Mainly just because or testing.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if(msg[0] === "prefix" && msg.length === 1) {
		bot.sendMessage(args[0], "I can be addressed using '" + bot.prefix + "'");
		return true;
	} else if(msg[0] === "prefix" && msg.length > 1) {
		bot.prefix = msg[1];
		bot.sendMessage(args[0], "I will now respond to '" + bot.prefix + "'");
		return true;
	}
});
core.registerPluginInfo("prefix", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "prefix [new] - Displays the current prefix for me. If an optional parameter is given, it will set the current prefix to it.");
});

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