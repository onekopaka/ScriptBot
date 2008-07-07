/**
 * Classic Rock Quote Plugin
 * Developed by Darren VanBuren July 2008
 * Licensed under GPL. Just like the rest of ScriptBot.
 */
core.unregisterPluginByEvent(Event.MESSAGE, "classicrock");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if(msg[0] === "classicrock") {
		if(classicrockquotes == undefined) {
				var classicrockquotes = [];
				// Money - Pink Floyd - Dark Side of the Moon
				classicrockquotes.push("I don't know, I was really drunk at the time.");
				classicrockquotes.push("Money, it's a hit. But don't give me that do goody good bullshit.");
				// Us and Them - Pink Floyd - Dark Side of the Moon
				classicrockquotes.push("You know they're gonna kill ya. So, like... if you give 'em a quick short, sharp shock, they don't do it again. Dig it? I mean he got off lightly, 'cos I could've given him a thrashing - I only hit him once! It was only a difference of right and wrong in it... I mean good manners don't cost nothing do they? 'Ey!");
				// Stairway to Heaven - Led Zepplin - Led Zepplin IV
				classicrockquotes.push("There's a lady who's sure all that glitters is gold, and she's buying a Stairway to Heaven.");
				// Hotel California - Eagles - Hotel California
				classicrockquotes.push("They stab it with their steely knifes, but they just can't kill the beast!");
				classicrockquotes.push("You can check out anytime you like, but you can never leave!");
		};
		var quote = classicrockquotes[Math.floor(Math.random()*classicrockquotes.length)];
		bot.sendMessage(args[0], args[1] + ": " + quote);
		return true;
	};
}, "classicrock");