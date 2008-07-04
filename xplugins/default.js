/**
* Weather Plugin
* Developed by Darren VanBuren July 2008
* Licensed under GPL. Just like the rest of ScriptBot.
*/
core.unregisterPluginByEvent(Event.MESSAGE, "weather");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if(msg[0] === "weather" && msg.length > 1) {
		// This build us a URL.
		url = "http://oks.verymad.net/~onekopaka/phpweather/scriptbot.php?icao=" + msg[1].toUpperCase();
		var report = IO.fetchURL(url, true);
		var output = "";
		for(var i in report) { output += report[i].replace(/^\s+/,"").replace(/\s+$/,"") + " "; }
		if(output.length < 390) {
			bot.sendMessage(args[0], args[1] + ": " + output);
		} else {
			var one = output.substring(0, 390);
			var two = output.substring(390);
			var match = one.substring(one.lastIndexOf(" "));
			one = one.replace(match, "");
			two = match.replace(/^\s+/,"") + two;
			bot.sendMessage(args[0], args[1] + ": " + one);
			bot.sendMessage(args[0], args[1] + ": " + two);
		}
		return true;
	} else if(msg[0] === "weather" && msg.length === 1) {
		bot.sendMessage(args[0], args[1] + ": No station provided.");
		//bot.sendAction(args[0], "slaps, kicks and punches " + args[1]); 
		return true;
	}
}, "weather");

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

/**
* Bugzilla Plugin
* Developed by Darren VanBuren July 2008
* Licensed under GPL. Just like the rest of ScriptBot.
*/
core.unregisterPluginByEvent(Event.MESSAGE, "bugzilla");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if(msg[0] === "bug") {
		// A bug? Get it!
		// For sample, we use OKS Bugzilla. DO NOT have trailing slash.
		var bugzilla = "http://oks.verymad.net/~onekopaka/bugzilla";
		// Construct URL for xml
		var url = bugzilla + "/show_bug.cgi?ctype=xml&excludefield=long_desc&id=" + msg[1];
		var xml = IO.fetchURL(url, true);
		// Construct URL for sending..
		var bugurl = bugzilla + "/show_bug.cgi?id=" + msg[1];
		bot.sendMessage(args[0], args[1] + ": "  + bugurl);
		return true;
	};
}, "bugzilla");
