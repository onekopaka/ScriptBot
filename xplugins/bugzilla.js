/**
 *  Bugzilla Plugin
 *  Developed by Darren VanBuren July 2008
 *  Licensed under GPL.
 *  Currently not finished. All it does is output
 *  a URL. We want to parse but whoever thought
 *  of an XML library for JavaScript?
 */
core.unregisterPluginByEvent(Event.MESSAGE, "bugzilla");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].split(/\s+/g);
	if(msg[0] === "bug") {
		// A bug? Get it!
		// Read the config for the bugzilla URL. If the config entry doesn't exist, use OKS Bugzilla.
		if(config.bugzillaurl != undefined) {
			var bugzilla = config.bugzillaurl;
		} else {
			var bugzilla = "http://oks.verymad.net/~onekopaka/bugzilla"
		}
		// Construct URL for xml
		var url = bugzilla + "/show_bug.cgi?ctype=xml&excludefield=long_desc&id=" + msg[1];
		//var xml = IO.fetchURL(url, true);
		// Construct URL for sending..
		var bugurl = bugzilla + "/show_bug.cgi?id=" + msg[1];
		bot.sendMessage(args[0], args[1] + ": "  + bugurl);
		return true;
	};
}, "bugzilla");