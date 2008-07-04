/************************************************
* A simple quote plugin. It responds to "quote" *
* and has the ability to specify a category for *
* the quote or just random from all categories  *
************************************************/

// All quotes.
var rquotes = [];

// Futurama category.
var cat = rquotes["futurama"] = rquotes[0] = [];
cat.push("Bite my shiny metal ass!");
cat.push("Good news everyone!");
cat.push("Why not Zoidberg?");

// Register to respond to @quote.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1];

	// Handle random quote.

	if(msg === "quote") {
		var quotes = rquotes[Math.min(Math.floor(Math.random()*rquotes.length), rquotes.length-1)];
		var quote = quotes[Math.min(Math.floor(Math.random()*quotes.length), quotes.length-1)];
		bot.sendMessage(args[0], quote);
		return true;
	} else {
		msg = msg.replace("quote").replace(/^\s+/,"");
		var quotes = rquotes[msg];

		if(quotes) {
			var quote = quotes[Math.min(Math.floor(Math.random()*quotes.length), quotes.length-1)];
			bot.sendMessage(args[0], quote);
		} else {
			bot.sendMessage(args[0], "Not a valid category, " + args[1]);
		}
		return true;
	}
});
core.registerPluginInfo("quote", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "quote [category] - Tells me to say a random quote. Optionally, a category from which to choose the quote can be specified.");
});

// A possible add on to allow triggers within a paragraph.
var rquoteRefireEvent = false;
core.registerUnrestrictedPlugin(Event.MESSAGE, function(bot, event, args, priv) {

	// Not if we caused this event!
	if(!rquoteRefireEvent) {

		// Find existence in message (if any).
		var found = false;
		for(var i in rquotes) {
			// if it is in the message, but not first.
			if(args[args.length-1].indexOf(rquotes[i]) > 0) {
				found = rquotes[i];
				break;
			}
		}

		// Random quote on mentioning ...
		var hasTarget = Util.verifyTarget(bot.getNick(), args[args.length-1]) || Util.verifyTarget(bot.prefix, args[args.length-1]);
		if(!hasTarget && found) {
			rquoteRefireEvent = true;
			bot.fireMessageEvent(Event.MESSAGE, [args[0],args[1],args[2],args[3],bot.prefix+"quote " + found], priv);
		}
	}
	rquoteRefireEvent = false;
});