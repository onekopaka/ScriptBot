/***************************************************
* A simple plugin which keeps track of the current *
* user with the most uninterupted lines of text.   *
* When a new person speaks, the count is restarted.*
*                                                  *
* Author: A.McBain, license: CC-BY-SA              *
***************************************************/

var monologue = {};

// Remove all old entries.
core.unregisterPlugin("monologue");

// Check all incoming messages.
core.registerUnrestrictedPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	if(args[0] !== monologue.nick) {
		monologue.nick = args[0];
		monologue.count = 1;
	} else {
		monologue.count++;
	}
}, "monologue");

// Check for nick changes, it is still the same person.
core.registerPlugin(Event.NICK_CHANGE, function(bot, event, args, priv) {
	if(args[0] === monologue.nick) {
		monologue.nick = args[args.length - 1];
	}
}, "monologue");


// Listen for people asking for the length.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	if(args[args.length - 1] === "monologue") {
		bot.sendMessage(args[0], "The current monologue is " + monologue.count + " lines.");
	}
}, "monologue");

// help
core.registerPluginInfo("monologue", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "monologue - reports length of the current monologue.");
});