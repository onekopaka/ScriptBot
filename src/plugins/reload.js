/**************************************************
* A test plugin to reload specified files. The    *
* filename given is automatically assumed to be   *
* ".js", so the extension should be omitted. In   *
* order for this plugin to work fully (and not    *
* just load a plugin twice) the specified plugin  *
* must have a line to unregister any previous     *
* copies of the plugin. This can be done by       *
* attaching an id to teh plugin and removing it   *
* by id in the first line of the file (which will *
* do nothing if it isn't loaded.                  *
**************************************************/

// Reloads the specified plugin.
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1].toLowerCase();

	// Only respond to "time" messages.
	if(msg.substring(0, 6) === "reload") {
		msg = Util.trim(msg.substring(6));

		if(msg !== "" && msg !== "reload") {
			try {
				IO.include("plugins" + IO.slash + msg + ".js");
			} catch(e) {
				bot.sendMessage(args[0], "Reloading plugin failed. Check your spelling, or maybe the plugin doesn't exist.");
			}
		} else {
			bot.sendMessage(args[0], "Please specify a plugin name to be reloaded, " + args[1]);
		}

		return true;
	}
});
core.registerPluginInfo("reload", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "reload [plugin] - Used for testing, (re)loads the given plugin's file.");
});