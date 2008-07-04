// Help
print("*NIX    - press ^C to force the program to end");
print("Windows - press ^C, then type 'y' to force end");
print("IRC     - use the quit command to close nicely\n");

// Create a new PircBot instance and start it up.
var core = createBot();

// Connecting to the server sometimes fails.
try {
	//core.initialize("ScriptBot", "irc.freenode.net", "#pircbot");
	core.initialize("ScriptBot", "irc.mozilla.org", "#bots");
} catch(e) {
	print(e);
	print("Program terminated.");
	System.exit(0); // Just in case.
}

// Yeah ... the bot doesn't do this for us. Could present problems if it did.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	if(args[args.length-1] === "quit") bot.exit();
});
core.registerPluginInfo("quit", function(bot, event, args, priv) {
	bot.sendMessage(args[0], "quit: Force me to leave IRC.");
});

// Load our test plugins.
IO.include("plugins/initplugins.js");
