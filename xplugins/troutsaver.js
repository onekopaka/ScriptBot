/***************************************************
* A simple plugin. It responds to                  *
* xxx slaps xxx xxx x xxx trout , etc. and saves   *
* the trout to the nearest river.                  *
*                                                  *
* Trout Saver Plugin - By A.McBain                 *
*                                                  *
* The Trout Saver plugin is licensed under the     *
* Creative Commons Attribution Share Alike License *
***************************************************/

var troutsaver = {};
if(IO.objectExists("troutsaver")) {
	troutsaver = IO.readObject("troutsaver");
}

// Remove any other "troutsaver" plugins.
core.unregisterPlugin("troutsaver");
// Reads off the current time somewhere.
core.registerUnrestrictedPlugin(Event.ACTION, function(bot, event, args, priv) {
	var msg = args[args.length-1].toLowerCase();
	var channel = args[3];

	// Only respond to "trout" messages.
	var results = msg.match(/slaps .* with a .* (.*)$/);
	if(results !== null && results.length > 0) {
		results[1] = results[1].replace(/[.?!]$/,"");
	
		bot.sendAction(channel, "picks up the " + results[1] + " and returns it to the nearest river");
		if(!troutsaver[results[1]]) {
			troutsaver[results[1]] = 0;
		}

		bot.sendMessage(channel, results[1] + "s saved: " + (++troutsaver[results[1]]));
		IO.writeObject("troutsaver", troutsaver);

		return true;
	}
}, "troutsaver");
core.registerPluginInfo("troutsaver", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "Saves trouts.");
});